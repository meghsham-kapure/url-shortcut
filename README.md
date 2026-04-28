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

## Api List

| Module | Method | Endpoint                    | Description                                        | Auth Required | Status  |
| ------ | ------ | --------------------------- | -------------------------------------------------- | ------------- | ------- |
| User   | POST   | /api/users/register         | Register a new user                                | No            | Ready   |
| User   | POST   | /api/users/login            | Authenticate a user and return a JWT               | No            | Ready   |
| User   | POST   | /api/users/logout           | Logout user and invalidate session                 | Yes           | Planned |
| User   | POST   | /api/auth/refresh           | Refresh access token                               | Yes           | Planned |
| User   | GET    | /api/users/:userId          | Retrieve a user profile by ID                      | Yes           | Planned |
| User   | PATCH  | /api/users/:userId          | Update user profile details                        | Yes           | Planned |
| User   | PATCH  | /api/users/:userId/password | Update user password                               | Yes           | Planned |
| User   | PATCH  | /api/users/:userId/         | Forgot user password                               | Yes           | Planned |
| User   | DELETE | /api/users/:userId          | Delete user and cascade delete associated URLs     | Yes           | Planned |
| User   | GET    | /api/users/availability     | Check username availability                        | No            | Planned |
| User   | PATCH  | /api/users/:userId/plan     | Upgrade or change user subscription plan           | Yes           | Planned |
| User   | PATCH  | /api/users/:userId/role     | Update user role or permissions                    | Yes           | Planned |
| User   | GET    | /api/users/:userId/activity | Retrieve user activity or audit logs               | Yes           | Planned |
| URL    | GET    | /api/urls/:shortcut         | Retrieve original URL for a shortcut               | No            | Planned |
| URL    | GET    | /:shortcut                  | Redirect to original URL                           | No            | Planned |
| URL    | GET    | /api/urls                   | Retrieve URLs owned by authenticated user          | Yes           | Planned |
| URL    | GET    | /api/users/:userId/urls     | Retrieve public URLs belonging to another user     | Yes           | Planned |
| URL    | GET    | /api/users/me/urls          | Retrieve URLs belonging to current user            | Yes           | Planned |
| URL    | POST   | /api/urls/shorten           | Create a new shortened URL                         | Yes           | Planned |
| URL    | DELETE | /api/urls/:shortcut         | Delete a shortened URL owned by authenticated user | Yes           | Planned |

