# short-url

A simple URL shortener service.

## Tech Stack

- Programming Language: JavaScript
  _(initially, with possible migration to TypeScript later)_
- Backend Framework: Node.js with Express.js (REST API)
- Database: PostgreSQL using Docker image `postgres:16-alpine`
- Containerization: Docker and Docker Compose
- ORM: Drizzle ORM with Drizzle Kit `v1.0.0-beta.2`
- Authentication: JWT (JSON Web Tokens)
- API Testing Tool: Bruno

## NPM Dependencies

### Production Dependencies

- express
- pg
- drizzle-orm
- dotenv

### Development Dependencies

- nodemon
- drizzle-kit
- @types/pg
- @types/express
- @types/node
- @types/drizzle

## Package Manager

- pnpm

## Project Documentation

### Api List
| Module | Method | Endpoint            | Description                                              | Auth Required |
|--------|--------|---------------------|----------------------------------------------------------|---------------|
| User   | POST   | /api/users/register | Register a new user                                      | No            |
| User   | POST   | /api/users/login    | Authenticate a user and return a JWT                     | No            |
| URL    | GET    | /api/urls/:shortcut | Retrieve the original URL for a given shortcut           | No            |
| URL    | GET    | /:shortcut          | Redirect to the original URL for a given shortcut        | No            |
| URL    | GET    | /api/urls           | Retrieve all URLs created by the authenticated user      | Yes           |
| URL    | POST   | /api/urls/shorten   | Create a new shortened URL for user                      | Yes           |
| URL    | DELETE | /api/urls/:shortcut | Delete a shortened URL created by the authenticated user | Yes           |

