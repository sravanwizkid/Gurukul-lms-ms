# Gurukul StudentMate Microservice

StudentMate API microservice for the Gurukul Learning Management System (LMS). This service handles student-specific operations and interactions within the Gurukul ecosystem.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- PostgreSQL 15.x or later
- Git

## Local Development Setup

1. **Clone the repository**

bash
git clone https://github.com/Wizkids-Gurukul/studentmate-ms.git
cd studentmate-ms

2. **Install dependencies**


3. **Environment Setup**
Create a `.env` file in the root directory:
env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=glms1
DB_USER=postgres
DB_PASSWORD=postgres123
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h


4. **Database Setup**
Create database
psql -U postgres
CREATE DATABASE glms1;
\c glms1
Run schema migrations
psql -U postgres -d glms1 -f backup.sql


5. **Start Development Server**



6. **Build for Production**
Run all tests
npm test
Run tests with coverage
npm run test:coverage
Run tests in CI mode
npm run test:ci


## API Documentation

### Authentication
- POST `/api/students/auth` - Student authentication
- Protected routes require Bearer token

### Student Routes
- GET `/api/students/subjects` - Get available subjects
- GET `/api/students/lessons` - Get lessons for a subject
- GET `/api/students/kitems` - Get knowledge items

## Deployment

The service is deployed to Google Cloud Run using GitHub Actions CI/CD pipeline.

### Environment Variables for Production
Required environment variables in Cloud Run:
- `NODE_ENV`
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests
4. Create a pull request

## License

Copyright © 2024 Wizkids Gurukul