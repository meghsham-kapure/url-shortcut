# Database Schema

> **Database:** PostgreSQL | **ORM:** Drizzle

---

## Tables Overview

| #   | Table                                            | Description                   |
| --- | ------------------------------------------------ | ----------------------------- |
| 1   | [users](#1-users)                                | Core auth table               |
| 2   | [user_details](#2-user-details)                  | Personal profile info         |
| 3   | [media](#3-media)                                | Cloudinary media assets       |
| 4   | [platforms](#4-platforms)                        | Social platform lookup        |
| 5   | [social_media_links](#5-social-media-links)      | User social profiles          |
| 6   | [links](#6-links)                                | General / affiliate links     |
| 7   | [urls](#7-url-shortener)                         | Short URL records             |
| 8   | [sessions](#8-sessions)                          | Auth sessions per device      |
| 9   | [plans](#9-plans)                                | Subscription plan definitions |
| 10  | [subscribe_plan_links](#10-subscribe-plan-links) | User ↔ plan join table        |
| 11  | [affiliated](#11-affiliated)                     | Affiliated link types         |
| 12  | [otp](#12-otp--verification)                     | OTP verification              |
| 13  | [analytics](#13-analytics--link-clicks)          | Link click tracking           |
| 14  | [notifications](#14-notifications)               | In-app notifications          |
| 15  | [audit_logs](#15-audit-logs)                     | Security audit trail          |

---

## 1. Users

> Core authentication table. All other tables reference this via `user_id`.

| Column            | Type      | Constraints                            | Notes                 |
| ----------------- | --------- | -------------------------------------- | --------------------- |
| `id`              | UUID      | PRIMARY KEY, DEFAULT gen_random_uuid() |                       |
| `username`        | VARCHAR   | UNIQUE, NOT NULL                       |                       |
| `email`           | VARCHAR   | UNIQUE, NOT NULL                       |                       |
| `phone`           | VARCHAR   | UNIQUE, NOT NULL                       |                       |
| `hashed_password` | VARCHAR   | NOT NULL                               | bcrypt / argon2       |
| `salt_password`   | VARCHAR   | NOT NULL                               | bcrypt / argon2       |
| `is_deactivated`  | BOOLEAN   | DEFAULT false                          | User self-deactivated |
| `is_blocked`      | BOOLEAN   | DEFAULT false                          | Admin blocked         |
| `last_login_at`   | TIMESTAMP | NULLABLE                               |                       |
| `created_at`      | TIMESTAMP | DEFAULT now()                          |                       |
| `updated_at`      | TIMESTAMP | DEFAULT now()                          |                       |

---

## 2. User Details

> One-to-one with users. Holds personal info, bio, and about section.

| Column                   | Type    | Constraints                            | Notes            |
| ------------------------ | ------- | -------------------------------------- | ---------------- |
| `id`                     | UUID    | PRIMARY KEY                            |                  |
| `user_id`                | UUID    | FK → users(id), ON DELETE CASCADE      |                  |
| `first_name`             | VARCHAR | NOT NULL                               |                  |
| `last_name`              | VARCHAR | NULLABLE                               |                  |
| `bio`                    | TEXT    | NULLABLE                               | Short tagline    |
| `about`                  | TEXT    | NULLABLE                               | Long description |
| `date_of_birth`          | DATE    | NULLABLE                               |                  |
| `title_prefix`           | ENUM    | mr, master, miss, mrs                  |                  |
| `gender`                 | ENUM    | male, female, nonbinary, not_specified |                  |
| `profile_completion_pct` | INTEGER | DEFAULT 0                              | 0–100            |

---

## 3. Media

> Stores Cloudinary URLs for all user media assets. One-to-many with users.

| Column                               | Type    | Constraints                       | Notes          |
| ------------------------------------ | ------- | --------------------------------- | -------------- |
| `id`                                 | UUID    | PRIMARY KEY                       |                |
| `user_id`                            | UUID    | FK → users(id), ON DELETE CASCADE |                |
| `profile_picture_media_url`          | VARCHAR |                                   | Cloudinary URL |
| `cover_image_media_url`              | VARCHAR |                                   | Cloudinary URL |
| `about_me_video_media_url`           | VARCHAR |                                   | Cloudinary URL |
| `name_pronunciation_audio_media_url` | VARCHAR |                                   | Cloudinary URL |

---

## 4. Platforms

> Lookup table for all supported social media platforms.

| Column     | Type    | Constraints         | Notes                       |
| ---------- | ------- | ------------------- | --------------------------- |
| `id`       | INTEGER | PRIMARY KEY, SERIAL |                             |
| `name`     | VARCHAR | NOT NULL            | e.g. Instagram, X           |
| `base_url` | VARCHAR | NULLABLE            | e.g. https://instagram.com/ |
| `icon_url` | VARCHAR | NULLABLE            | CDN URL                     |

---

## 5. Social Media Links

> References platforms via `platform_id`. One row per platform per user.

| Column              | Type      | Constraints                       | Notes            |
| ------------------- | --------- | --------------------------------- | ---------------- |
| `id`                | UUID      | PRIMARY KEY                       |                  |
| `user_id`           | UUID      | FK → users(id), ON DELETE CASCADE |                  |
| `platform_id`       | INTEGER   | NOT NULL, FK → platforms(id)      |                  |
| `platform_username` | VARCHAR   | NOT NULL                          |                  |
| `url`               | VARCHAR   | NOT NULL                          | Full profile URL |
| `is_active`         | BOOLEAN   | DEFAULT true                      |                  |
| `created_at`        | TIMESTAMP | DEFAULT now()                     |                  |
| `updated_at`        | TIMESTAMP | DEFAULT now()                     |                  |

---

## 6. Links

> General link table — short links, affiliate, product, referral links.

| Column      | Type    | Constraints                                   | Notes               |
| ----------- | ------- | --------------------------------------------- | ------------------- |
| `id`        | UUID    | PRIMARY KEY                                   |                     |
| `user_id`   | UUID    | FK → users(id), ON DELETE CASCADE             |                     |
| `title`     | VARCHAR | NOT NULL                                      | Display name        |
| `url`       | VARCHAR | NOT NULL                                      | Target URL          |
| `type`      | ENUM    | social, affiliate, referral, product, service |                     |
| `priority`  | INTEGER | DEFAULT 0                                     | Display ordering    |
| `metadata`  | JSONB   | NULLABLE                                      | price, rating, etc. |

---

## 7. URL Shortener

> Short URL records with expiry and active status.

| Column         | Type      | Constraints                       | Notes           |
| -------------- | --------- | --------------------------------- | --------------- |
| `id`           | UUID      | PRIMARY KEY                       |                 |
| `user_id`      | UUID      | FK → users(id), ON DELETE CASCADE |                 |
| `short_code`   | VARCHAR   | UNIQUE, NOT NULL                  | e.g. abc123     |
| `original_url` | VARCHAR   | NOT NULL                          | Source URL      |
| `target_url`   | VARCHAR   | NOT NULL                          | Destination URL |
| `description`  | TEXT      | NULLABLE                          |                 |
| `is_active`    | BOOLEAN   | DEFAULT true                      |                 |
| `created_at`   | TIMESTAMP | DEFAULT now()                     |                 |
| `expired_at`   | TIMESTAMP | NULLABLE                          |                 |

---

## 8. Sessions

> Supports multiple sessions per user. `device_identifier` tracks which device each session belongs to.

| Column              | Type      | Constraints                       | Notes                      |
| ------------------- | --------- | --------------------------------- | -------------------------- |
| `id`                | UUID      | PRIMARY KEY                       |                            |
| `user_id`           | UUID      | FK → users(id), ON DELETE CASCADE |                            |
| `refresh_token`     | VARCHAR   | NOT NULL                          |                            |
| `device_identifier` | VARCHAR   | NULLABLE                          | Client-generated device ID |
| `created_at`        | TIMESTAMP | DEFAULT now()                     |                            |
| `expired_at`        | TIMESTAMP | NULLABLE                          |                            |

---

## 9. Plans

> Subscription plan definitions. Not tied to any user directly.

| Column            | Type          | Constraints      | Notes                |
| ----------------- | ------------- | ---------------- | -------------------- |
| `id`              | UUID          | PRIMARY KEY      |                      |
| `plan_identifier` | VARCHAR       | UNIQUE, NOT NULL | e.g. premium_monthly |
| `title`           | VARCHAR       | NOT NULL         | Display name         |
| `description`     | TEXT          | NULLABLE         |                      |
| `validity`        | INTEGER       | NOT NULL         | Duration in days     |
| `price`           | DECIMAL(10,2) | NOT NULL         |                      |
| `is_active`       | BOOLEAN       | DEFAULT true     |                      |
| `created_at`      | TIMESTAMP     | DEFAULT now()    |                      |
| `updated_at`      | TIMESTAMP     | DEFAULT now()    |                      |

---

## 10. Subscribe Plan Links

> Join table between users and plans. Tracks subscription lifecycle.

| Column          | Type      | Constraints                       | Notes |
| --------------- | --------- | --------------------------------- | ----- |
| `id`            | UUID      | PRIMARY KEY                       |       |
| `user_id`       | UUID      | FK → users(id), ON DELETE CASCADE |       |
| `plan_id`       | UUID      | FK → plans(id), ON DELETE CASCADE |       |
| `subscribed_at` | TIMESTAMP | DEFAULT now()                     |       |
| `expired_at`    | TIMESTAMP | NULLABLE                          |       |
| `is_active`     | BOOLEAN   | DEFAULT true                      |       |

---

## 11. Affiliated

> Tracks affiliated link types per user.

| Column    | Type | Constraints                       | Notes    |
| --------- | ---- | --------------------------------- | -------- |
| `id`      | UUID | PRIMARY KEY                       |          |
| `user_id` | UUID | FK → users(id), ON DELETE CASCADE |          |
| `type`    | ENUM | product, service, referral_link   | NOT NULL |

---

## 12. OTP / Verification

> One-time passwords for email and phone verification flows.

| Column       | Type      | Constraints                       | Notes                  |
| ------------ | --------- | --------------------------------- | ---------------------- |
| `id`         | UUID      | PRIMARY KEY                       |                        |
| `user_id`    | UUID      | FK → users(id), ON DELETE CASCADE |                        |
| `otp_code`   | VARCHAR   | NOT NULL                          | Hashed recommended     |
| `type`       | ENUM      | email, phone                      | NOT NULL               |
| `is_used`    | BOOLEAN   | DEFAULT false                     |                        |
| `created_at` | TIMESTAMP | DEFAULT now()                     |                        |
| `expired_at` | TIMESTAMP | NOT NULL                          | Short TTL e.g. 10 mins |

---

## 13. Analytics / Link Clicks

> Tracks every click on user links for analytics dashboard.

| Column       | Type      | Constraints                       | Notes             |
| ------------ | --------- | --------------------------------- | ----------------- |
| `id`         | UUID      | PRIMARY KEY                       |                   |
| `link_id`    | UUID      | FK → links(id), ON DELETE CASCADE |                   |
| `user_id`    | UUID      | NULLABLE, FK → users(id)          | Viewer, not owner |
| `clicked_at` | TIMESTAMP | DEFAULT now()                     |                   |
| `ip_address` | VARCHAR   | NULLABLE                          |                   |
| `device`     | VARCHAR   | NULLABLE                          |                   |
| `country`    | VARCHAR   | NULLABLE                          |                   |

---

## 14. Notifications

> In-app notification records per user.

| Column       | Type      | Constraints                       | Notes |
| ------------ | --------- | --------------------------------- | ----- |
| `id`         | UUID      | PRIMARY KEY                       |       |
| `user_id`    | UUID      | FK → users(id), ON DELETE CASCADE |       |
| `title`      | VARCHAR   | NOT NULL                          |       |
| `message`    | TEXT      | NOT NULL                          |       |
| `is_read`    | BOOLEAN   | DEFAULT false                     |       |
| `created_at` | TIMESTAMP | DEFAULT now()                     |       |

---

## 15. Audit Logs

> Tracks sensitive user and admin actions for security and debugging.

| Column       | Type      | Constraints              | Notes                   |
| ------------ | --------- | ------------------------ | ----------------------- |
| `id`         | UUID      | PRIMARY KEY              |                         |
| `user_id`    | UUID      | NULLABLE, FK → users(id) | Null for system actions |
| `action`     | VARCHAR   | NOT NULL                 | e.g. USER_BLOCKED       |
| `metadata`   | JSONB     | NULLABLE                 | Additional context      |
| `created_at` | TIMESTAMP | DEFAULT now()            |                         |

---

## Relationships Summary

| Table                | Type        | Related To | FK Column                                     |
| -------------------- | ----------- | ---------- | --------------------------------------------- |
| user_details         | One-to-One  | users      | user_details.user_id → users.id               |
| media                | One-to-Many | users      | media.user_id → users.id                      |
| social_media_links   | One-to-Many | users      | social_media_links.user_id → users.id         |
| social_media_links   | Many-to-One | platforms  | social_media_links.platform_id → platforms.id |
| links                | One-to-Many | users      | links.user_id → users.id                      |
| urls                 | One-to-Many | users      | urls.user_id → users.id                       |
| sessions             | One-to-Many | users      | sessions.user_id → users.id                   |
| affiliated           | One-to-Many | users      | affiliated.user_id → users.id                 |
| subscribe_plan_links | Many-to-One | users      | subscribe_plan_links.user_id → users.id       |
| subscribe_plan_links | Many-to-One | plans      | subscribe_plan_links.plan_id → plans.id       |
| analytics            | Many-to-One | links      | analytics.link_id → links.id                  |
| otp                  | One-to-Many | users      | otp.user_id → users.id                        |
| notifications        | One-to-Many | users      | notifications.user_id → users.id              |
| audit_logs           | One-to-Many | users      | audit_logs.user_id → users.id                 |
