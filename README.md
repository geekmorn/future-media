# Future Media

A modern social media platform built as a monorepo with NestJS backend and Next.js frontend.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Running Services Individually](#running-services-individually)
- [Testing](#testing)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)

## Tech Stack

### Backend (API)

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Database**: SQLite (Better-SQLite3)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: JWT (access + refresh tokens), Google OAuth
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

### Frontend (Web)

- **Framework**: [Next.js](https://nextjs.org/) v16 (App Router)
- **UI**: [React](https://react.dev/) v19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Compiler**: React Compiler (babel-plugin-react-compiler)

### Monorepo & Tooling

- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **Linting**: ESLint with shared configs
- **Formatting**: Prettier
- **Type Checking**: TypeScript v5
- **Containerization**: Docker & Docker Compose

## Project Structure

```
future-media/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── common/      # Shared utilities, guards, decorators
│   │   │   ├── config/      # Configuration files
│   │   │   ├── entities/    # TypeORM entities
│   │   │   └── modules/     # Feature modules (auth, posts, tags, users)
│   │   └── Dockerfile
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── app/         # App router pages & API routes
│       │   ├── components/  # React components
│       │   ├── hooks/       # Custom React hooks
│       │   └── lib/         # Utilities & configurations
│       └── Dockerfile
├── packages/
│   ├── eslint-config/       # Shared ESLint configurations
│   ├── tsconfig/            # Shared TypeScript configurations
│   └── types/               # Shared TypeScript types
├── docker-compose.yml
├── .env.example
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Environment Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd future-media
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and configure the required variables:

```bash
# Generate secure JWT secrets
openssl rand -base64 32  # Use output for JWT_SECRET
openssl rand -base64 32  # Use output for JWT_REFRESH_SECRET
```

4. Install dependencies:

```bash
pnpm install
```

### Running with Docker Compose

The easiest way to run the full stack:

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

Services will be available at:

- **Web App**: http://localhost:3000
- **API**: http://localhost:4050
- **API Docs**: http://localhost:4050/docs

### Running Services Individually

#### Development Mode

Run both services concurrently:

```bash
pnpm dev
```

Or run services separately in different terminals:

```bash
# Terminal 1 - API
pnpm dev:api

# Terminal 2 - Web
pnpm dev:web
```

#### Production Mode

1. Build all services:

```bash
pnpm build
```

2. Start services:

```bash
# Terminal 1 - API
pnpm start:api

# Terminal 2 - Web
pnpm start:web
```

## Testing

The API includes unit tests and e2e tests using Jest.

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm --filter @app/api test:cov

# Run e2e tests
pnpm test:e2e
```

### Test Structure

```
apps/api/
├── src/
│   └── modules/
│       ├── auth/
│       │   └── auth.service.spec.ts      # Auth service unit tests
│       ├── posts/
│       │   └── posts.service.spec.ts     # Posts service unit tests
│       └── tags/
│           └── tags.service.spec.ts      # Tags service unit tests
└── test/
    └── app.e2e-spec.ts                   # End-to-end tests
```

## Database Seeding

To populate the database with test data, run the seed script:

```bash
# From the root directory
cd apps/api && pnpm seed:posts

# Or if you're already in apps/api
pnpm seed:posts
```

The seed script creates:

- **5 test users**: `alice`, `bob`, `charlie`, `diana`, `eve` (password: `password123`)
- **20 tags**: javascript, typescript, react, nodejs, python, rust, go, docker, kubernetes, aws, database, frontend, backend, devops, testing, security, api, graphql, nextjs, tailwind
- **500 posts**: Random content from sample templates with random tags and dates (last 90 days)

> **Note**: The script is idempotent for users and tags - running it multiple times will not duplicate existing users or tags, but will create additional posts.

## API Documentation

Swagger documentation is available at:

- **Development**: http://localhost:4050/docs
- **Production**: http://your-api-url/docs

## Scripts

| Script            | Description                                        |
| ----------------- | -------------------------------------------------- |
| `pnpm dev`        | Start all services in development mode             |
| `pnpm dev:api`    | Start API in development mode                      |
| `pnpm dev:web`    | Start Web in development mode                      |
| `pnpm build`      | Build all services                                 |
| `pnpm build:api`  | Build API                                          |
| `pnpm build:web`  | Build Web                                          |
| `pnpm start:api`  | Start API in production mode                       |
| `pnpm start:web`  | Start Web in production mode                       |
| `pnpm lint`       | Run ESLint across all packages                     |
| `pnpm format`     | Format code with Prettier                          |
| `pnpm test`       | Run API unit tests                                 |
| `pnpm test:watch` | Run API tests in watch mode                        |
| `pnpm test:e2e`   | Run API end-to-end tests                           |
| `pnpm seed:posts` | Seed database with test data (run from `apps/api`) |
