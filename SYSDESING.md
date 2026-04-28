# URL Shortener — System Design

A production-grade system design reference for building a scalable URL shortening service (like bit.ly / TinyURL). Use this as your north star while building.

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Functional Requirements](#functional-requirements)
3. [Non-Functional Requirements](#non-functional-requirements)
4. [Capacity Estimation](#capacity-estimation)
5. [Design Goals](#design-goals)
6. [High-Level Design](#high-level-design)
7. [API Design](#api-design)
8. [Database Design](#database-design)
9. [Algorithm — Short Code Generation](#algorithm--short-code-generation)
10. [Scaling Strategy](#scaling-strategy)
11. [Tech Stack](#tech-stack)

## Problem Statement

Design a URL shortening service that:

- Accepts a long URL and returns a short, unique URL
- Redirects anyone who visits the short URL to the original long URL
- Is highly available, low latency, and handles massive read traffic

## Functional Requirements

| #   | Feature     | Description                                                             |
| --- | ----------- | ----------------------------------------------------------------------- |
| 1   | Shorten URL | Given a long URL, generate a unique short URL                           |
| 2   | Redirect    | Visiting the short URL redirects the user to the original URL           |
| 3   | URL Expiry  | Every short URL has a TTL (default: 10 years). Expired URLs are purged. |
| 4   | User Auth   | Users must sign up and log in. Each user gets an API key.               |
| 5   | Delete URL  | A URL owner can delete their own short URL                              |

## Non-Functional Requirements

| Requirement          | Detail                                                                             |
| -------------------- | ---------------------------------------------------------------------------------- |
| High Availability    | System must be accessible 24×7. No single point of failure.                        |
| Low Latency          | Redirects must feel instant (target < 100ms via caching)                           |
| Unpredictable Codes  | Short codes must not be sequential/guessable — randomness required                 |
| Read-Heavy           | Read : Write ratio = 100 : 1. Design optimised for reads.                          |
| Eventual Consistency | For URL resolution — acceptable. Counter generation — must be strongly consistent. |

## Capacity Estimation

### Assumptions (from interviewer)

| Parameter           | Value              |
| ------------------- | ------------------ |
| New URLs per month  | 1 Million          |
| Read : Write ratio  | 100 : 1            |
| URL expiry          | 10 years           |
| Avg URL record size | ~500 bytes         |
| Cache TTL           | 1 day              |
| Cache ratio         | 25% of daily reads |

### Storage

```
Total URLs in 10 years = 1M × 12 months × 10 years = 120 Million URLs

Storage = 120M × 500 bytes = 60,000,000,000 bytes ≈ 60 GB
```

> 60 GB on disk (HDD/SSD) is sufficient for 10 years of data.

### Throughput (QPS)

```
Seconds in a month = 30 × 24 × 3600 ≈ 2,592,000 ≈ 2.5M seconds

Write QPS = 1,000,000 / 2,500,000 ≈ 0.4 writes/sec  (≈ 1 new URL/sec, negligible)

Read QPS  = Write QPS × 100 = ~40 reads/sec
          = 100M redirections / month ÷ 2.5M seconds ≈ 40 QPS
```

> System is not write-intensive. Read path is the bottleneck.

### Cache (RAM)

```
Daily reads = 40 QPS × 86,400 sec = ~3.5 Million reads/day

Cache 25% of daily reads = 3.5M × 0.25 = ~875,000 entries

RAM = 875,000 × 500 bytes ≈ 437 MB ≈ ~1 GB (with overhead)
```

> ~1 GB of RAM needed for Redis cache with a 1-day TTL.

### Short Code Length

```
62 characters available: [a-z] + [A-Z] + [0-9]

Total unique URLs needed = 120 Million

Solve: 62^n > 120,000,000
       n = ceil(log₆₂(120,000,000)) = ceil(4.5) = 5 (minimum)

Industry standard → use n = 7

62^7 = 3,521,614,606,208 ≈ 3.5 Trillion combinations
```

> Use 7-character Base-62 short codes. Supports 3.5 Trillion unique URLs — safe headroom.

## Design Goals

| Goal                        | Decision                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| Availability vs Consistency | Prefer Availability (AP in CAP theorem). Eventual consistency is acceptable for URL resolution. |
| Read vs Write               | Optimise for reads — multiple read replicas, aggressive caching                                 |
| Latency                     | Redis LRU cache in front of DB for redirect path                                                |
| Security                    | API key per user. Rate limiting on write endpoints.                                             |

## High-Level Design

### Write Path (Create Short URL)

```
Client
  │
  ▼
Load Balancer
  │
  ▼
URL Shortener Service  (one of N horizontal replicas)
  │
  ├──► ZooKeeper          (claim unique counter range)
  │
  ▼
MongoDB (Primary / Write node)
```

Step-by-step:

1. Client sends `POST /api/v1/shorten` with long URL + API key in header
2. Load balancer routes request to one of the URL Shortener Service instances
3. Service fetches its current counter value (pre-allocated range from ZooKeeper)
4. Counter is Base-62 encoded → produces a 7-char unique short code
5. Mapping `{ short_code → original_url, user_id, expiry }` is persisted to MongoDB primary

### Read Path (Redirect)

```
Client
  │
  ▼
Load Balancer
  │
  ▼
Redirect Service
  │
  ├──► Redis Cache  ──── HIT ──► 301/302 Redirect to original URL
  │
  └──► MongoDB (Read Replica)  ──── populate cache ──► Redirect
```

Step-by-step:

1. Client hits `GET /{shortCode}`
2. Redirect Service checks Redis LRU cache first
3. Cache hit → return 301/302 redirect immediately (< 5ms)
4. Cache miss → query MongoDB read replica → populate cache with TTL = 1 day → return redirect

### Architecture Diagram

```

                    ┌──────────────────────────────────────────┐
                    │              Load Balancer               │
                    └──────────────────┬───────────────────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
  ┌─────────────────┐         ┌─────────────────┐        ┌─────────────────┐
  │  App Server 1   │         │  App Server 2   │        │  App Server N   │
  │ (Shortener +    │         │ (Shortener +    │        │ (Shortener +    │
  │  Redirect Svc)  │         │  Redirect Svc)  │        │  Redirect Svc)  │
  └────────┬────────┘         └────────┬────────┘        └────────┬────────┘
           │                           │                          │
           └───────────────────────────┼──────────────────────────┘
                                       │
                  ┌────────────────────┼─────────────────────┐
                  │                    │                     │
                  ▼                    ▼                     ▼
         ┌──────────────┐    ┌───────────────────┐   ┌──────────────┐
         │  ZooKeeper   │    │   Redis Cache     │   │   MongoDB    │
         │ (Counter     │    │  (LRU, TTL=1day)  │   │  Primary +   │
         │  Ranges)     │    │                   │   │  N Replicas  │
         └──────────────┘    └───────────────────┘   └──────────────┘

```

## API Design

### `POST /api/v1/shorten` — Create Short URL

Headers: `X-API-Key: <user_api_key>`

Request body:

```json
{
  "original_url": "https://www.example.com/some/very/long/path?query=value",
  "user_id": "abc123",
  "expiry_date": "2035-01-01"
}
```

Response:

```json
{
  "short_url": "https://sho.rt/aB3xK9m",
  "original_url": "https://www.example.com/some/very/long/path?query=value",
  "expiry_date": "2035-01-01"
}
```

### `GET /{shortCode}` — Redirect

No body or auth required.

Response:

- `301 Moved Permanently` — browser caches the redirect (no analytics, less traffic)
- `302 Found` — every request hits your server (enables click tracking, A/B tests)

> Decision: Use `301` if analytics are not needed (reduces server load). Use `302` if you need per-click analytics.

### `DELETE /api/v1/url/{shortCode}` — Delete URL

Headers: `X-API-Key: <user_api_key>`

Response:

```json
{ "message": "URL deleted successfully" }
```

Only the URL owner can delete. Service validates `user_id` from API key against the stored `user_id` on the URL record.

### `POST /api/v1/signup` — Register User

Request body:

```json
{ "name": "Rahul", "email": "rahul@example.com", "password": "secret" }
```

Response:

```json
{ "user_id": "abc123", "api_key": "xK9mP2qR..." }
```

### `POST /api/v1/login` — Login

Request body:

```json
{ "email": "rahul@example.com", "password": "secret" }
```

Response:

```json
{ "token": "eyJhbGciOiJIUzI1Ni..." }
```

## Database Design

### Why MongoDB?

| Factor             | MongoDB (chosen)                     | PostgreSQL (not chosen) |
| ------------------ | ------------------------------------ | ----------------------- |
| Horizontal scaling | Native sharding                      | Harder to shard         |
| Consistency        | Eventual — acceptable                | Strong ACID — overkill  |
| Schema             | Flexible, no joins needed            | Rigid schema            |
| Read replicas      | Built-in replica sets                | Possible but complex    |
| Scalability        | Auto-sharding via consistent hashing | Manual partitioning     |

> This is a read-heavy, key-value lookup workload. NoSQL (MongoDB) is the right tool.

### Collection: `urls`

```js
{
  _id:          ObjectId,          // Primary key (auto)
  short_code:   String,            // "aB3xK9m" — UNIQUE INDEX
  original_url: String,            // Full long URL
  user_id:      ObjectId,          // FK → users._id
  expiry_date:  Date,              // URL expiry timestamp
  created_at:   Date               // Creation timestamp
}
```

Indexes:

- `short_code` → Unique index (primary lookup key for redirects)
- `user_id` → Index (for listing/deleting a user's URLs)
- `expiry_date` → TTL index (MongoDB auto-deletes expired documents)

### Collection: `users`

```js
{
  _id:        ObjectId,   // Primary key
  name:       String,
  email:      String,     // UNIQUE INDEX
  api_key:    String,     // UNIQUE INDEX — generated on signup
  created_at: Date
}
```

## Algorithm — Short Code Generation

### Approach Comparison

| Approach                  | Problem                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- |
| Random number + store     | Collision on DB insert possible; requires check + retry loop                  |
| MD5 hash of URL           | 128-bit output; taking first 6–7 chars risks collision between different URLs |
| Base-62 of unique counter | ✅ No collision possible. Guaranteed unique per counter value.                |

### Base-62 Encoding

Charset: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`

- 26 lowercase + 26 uppercase + 10 digits = 62 characters

How it works:

```
Input:  a unique integer (e.g. 125)
Output: Base-62 string (e.g. "cb")

Algorithm:
  while n > 0:
    remainder = n % 62
    result    = CHARSET[remainder] + result
    n         = n // 62
```

Sample implementation (Python):

```python
CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

def encode(num: int) -> str:
    result = []
    while num > 0:
        result.append(CHARSET[num % 62])
        num //= 62
    return ''.join(reversed(result)).zfill(7)  # pad to 7 chars
```

### Unique Counter Generation — ZooKeeper

The problem with a single counter:

- If multiple app servers share one counter → race condition → duplicate short codes
- A single Redis counter works but is a single point of failure

The problem with two Redis instances (naive approach):

- Give Redis-1 range [0 → 1B], Redis-2 range [1B → 2B]
- Works, but: adding a 3rd server requires manual range reconfiguration. If one Redis crashes, its range is lost.

Solution: Apache ZooKeeper

```
ZooKeeper assigns non-overlapping counter ranges to each app server:

  App Server 1  →  range [0,         1,000,000)
  App Server 2  →  range [1,000,000, 2,000,000)
  App Server 3  →  range [2,000,000, 3,000,000)

When a server exhausts its range → claims the next available range from ZooKeeper.
Adding/removing servers → ZooKeeper handles range coordination automatically.
```

Write flow with ZooKeeper:

```
1. New write request arrives at App Server 1
2. Server checks its local counter (e.g. current = 500,342)
3. Increments counter → 500,343
4. Encodes 500,343 to Base-62 → "0aB3x" (padded to 7 chars)
5. Stores { short_code: "0aB3x", original_url: "...", ... } in MongoDB
6. Returns short URL to client
```

No DB round-trip needed to check uniqueness — the counter range is pre-allocated and only used by one server.

## Scaling Strategy

### 1. Caching (Read Path)

```
Cache Type  : Redis with LRU eviction
TTL         : 1 day
Cached %    : Top 25% of daily read queries
RAM needed  : ~1 GB

Cache key   : short_code
Cache value : original_url
```

On cache miss: query MongoDB read replica → store in Redis → redirect.

### 2. Database — Read Replicas

```
MongoDB Replica Set:
  ┌─────────────────┐
  │  Primary Node   │  ← All WRITES go here
  └────────┬────────┘
           │ Replication
  ┌────────┴────────┐
  │  Read Replica 1 │  ← Redirect service reads
  │  Read Replica 2 │  ← Redirect service reads
  │  Read Replica N │  ← Redirect service reads
  └─────────────────┘
```

Read : Write = 100 : 1, so spinning up multiple read replicas directly scales the bottleneck.

### 3. Database — Consistent Hash Partitioning (Sharding)

When a single MongoDB replica set can't handle the data volume:

```
Shard by: short_code (the primary lookup key)
Strategy: Consistent Hashing

Benefits:
  - Even data distribution across shards
  - Adding/removing shards redistributes minimal data (only ~1/N of keys move)
  - Avoids hotspots compared to range-based sharding
```

### 4. App Server Horizontal Scaling

- Stateless app servers — any server can handle any request
- Add instances behind the load balancer freely
- Each new instance claims a fresh counter range from ZooKeeper on startup

### 5. URL Cleanup (Expiry)

- MongoDB TTL index on `expiry_date` field auto-deletes expired documents
- Run a periodic cleanup job (cron/worker) to also evict expired keys from Redis

## Tech Stack

| Layer         | Technology                      | Reason                                    |
| ------------- | ------------------------------- | ----------------------------------------- |
| App Framework | Node.js / FastAPI / Spring Boot | Your choice — stateless REST service      |
| Database      | MongoDB                         | Horizontal scale, eventual consistency OK |
| Cache         | Redis (LRU)                     | Sub-millisecond lookups for redirect path |
| Coordination  | Apache ZooKeeper                | Distributed counter range allocation      |
| Load Balancer | Nginx / AWS ALB                 | Round-robin across app server pool        |
| Short Code    | Base-62 encoding                | Collision-free, URL-safe, compact         |
| Auth          | API key + JWT                   | Per-user API key for write access         |
| Deployment    | Docker + Kubernetes             | Horizontal scaling of stateless services  |

## Project Structure (Suggested)

```
url-shortener/
├── README.md                   ← You are here
├── docker-compose.yml
├── .env.example
│
├── src/
│   ├── routes/
│   │   ├── shorten.js          # POST /api/v1/shorten
│   │   ├── redirect.js         # GET /:shortCode
│   │   ├── auth.js             # signup / login
│   │   └── url.js              # DELETE /api/v1/url/:code
│   │
│   ├── services/
│   │   ├── encoder.js          # Base-62 encode/decode
│   │   ├── counter.js          # ZooKeeper counter range manager
│   │   ├── cache.js            # Redis get/set wrapper
│   │   └── url.service.js      # Core business logic
│   │
│   ├── models/
│   │   ├── url.model.js        # MongoDB URL schema
│   │   └── user.model.js       # MongoDB User schema
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js  # API key validation
│   │   └── rateLimit.js        # Rate limiting on write endpoints
│   │
│   └── config/
│       ├── db.js               # MongoDB connection
│       ├── redis.js            # Redis connection
│       └── zookeeper.js        # ZooKeeper client setup
│
└── tests/
    ├── encoder.test.js
    ├── shorten.test.js
    └── redirect.test.js
```

## Key Design Decisions Summary

| Decision             | Choice                          | Reason                                                      |
| -------------------- | ------------------------------- | ----------------------------------------------------------- |
| DB type              | MongoDB                         | Horizontal scale, no complex joins, eventual consistency OK |
| Short code algorithm | Base-62 + ZooKeeper counter     | Zero collisions, no retry logic needed                      |
| Short code length    | 7 characters                    | 3.5 Trillion combinations — safe for decades                |
| Caching              | Redis LRU, 1-day TTL            | Redirect path must be sub-100ms                             |
| Redirect type        | 301 (default) / 302 (analytics) | 301 reduces server load; use 302 only if tracking clicks    |
| Counter coordination | ZooKeeper                       | Handles N app servers without manual range management       |
| DB read scaling      | Read replicas                   | Matches 100:1 read-write ratio                              |
| DB write scaling     | Consistent hash sharding        | Even distribution, minimal rebalancing on node changes      |

_Built from system design principles. Start with the monolith, extract services as traffic demands._
