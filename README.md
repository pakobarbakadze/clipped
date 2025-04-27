# Clipped

Clipped is a modern video clip management backend built with NestJS that allows users to upload, organize, and stream video clips securely from the cloud.

## Features

- **User Authentication**
  - JWT-based authentication
  - Two-factor authentication with QR code generation
  - User registration and profile management

- **Clip Management**
  - Upload video clips to cloud storage
  - Organize clips by categories
  - Retrieve clips with filtering and pagination
  - User-specific clip collections
  - Fast clip metadata retrieval with DynamoDB

- **Cloud Storage**
  - AWS S3 integration for scalable file storage
  - Secure file access with pre-signed URLs
  - Efficient clip streaming

- **API Documentation**
  - OpenAPI/Swagger documentation
  - Interactive API testing

## Tech Stack

### Core Framework
- [NestJS](https://nestjs.com/) v10 - Progressive Node.js framework
- TypeScript - Type-safe development
- Express - HTTP server framework

### Database & Storage
- PostgreSQL with TypeORM - Relational database
- AWS DynamoDB - NoSQL database for clip metadata
- AWS S3 - Cloud file storage for video content

### Authentication & Security
- Passport.js - Authentication middleware
- JWT - Token-based authentication
- bcrypt - Password hashing
- Speakeasy - Two-factor authentication

### Monitoring & Logging
- Winston - Advanced logging with daily rotation
- Prometheus - Metrics collection
- Joi - Request validation

### Development & Testing
- Jest - Unit and integration testing
- Supertest - API testing
- ESLint/Prettier - Code quality and formatting

## Project Structure

```
src/
  ├── common/         # Shared decorators, filters, guards, etc.
  ├── config/         # Configuration settings
  ├── modules/        # Feature modules
  │   ├── auth/       # Authentication functionality
  │   ├── clip/       # Clip management
  │   ├── file/       # File handling
  │   └── user/       # User management
  ├── shared/         # Shared services
  │   ├── aws/        # AWS integrations
  │   └── logger/     # Logging service
  ├── app.module.ts   # Main application module
  └── main.ts         # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm
- PostgreSQL
- AWS account (for S3 access)
- Docker & Docker Compose (optional)

### Installation

1. Clone the repository
```bash
git clone git@github.com:pakobarbakadze/clipped.git
cd clipped
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` file with your configuration settings.

4. Run the application
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

### Local Development Environment

The project includes a complete local development environment with Docker:

```bash
docker compose up
```

## API Documentation

Once the application is running, API documentation is available at:
```
http://localhost:9999/api/docs
```

## Monitoring

Prometheus metrics are exposed at:
```
http://localhost:9999/metrics
```

## Testing

```bash
# Unit tests
pnpm test

# Test with coverage
pnpm test:cov

# End-to-end tests
pnpm test:e2e
```

### DynamoDB Setup

To create the required DynamoDB tables:

```bash
pnpm run setup:dynamodb
```

To explore DynamoDB data locally:


```bash
pnpm run dynamodb-admin
```

## License

This project is [UNLICENSED](LICENSE).