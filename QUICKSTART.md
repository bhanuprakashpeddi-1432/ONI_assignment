# Quick Start Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/library_db?schema=public"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed

# Start backend
npm run start:dev
```

Backend will run on http://localhost:3000

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start frontend
npm run dev
```

Frontend will run on http://localhost:5173

### 3. Using Docker (Alternative)

```bash
# From project root
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Backend on port 3000
- Frontend on port 5173

## Default Login Credentials

- **Admin**: admin@library.com / admin123
- **User**: john@example.com / user123

## API Testing

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'
```

### Get Books (with token)
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Features

✅ JWT Authentication
✅ Books CRUD with filtering
✅ Authors CRUD
✅ Users management
✅ Borrow/Return system
✅ Real-time availability tracking
✅ Modern, responsive UI
✅ Docker support
✅ TypeScript throughout
✅ Input validation
✅ Error handling

## Tech Stack

**Backend**: NestJS, Prisma, PostgreSQL, JWT
**Frontend**: React, TypeScript, Axios, React Router
**DevOps**: Docker, Docker Compose

## Project Structure

```
library-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── authors/
│   │   ├── books/
│   │   ├── borrowed-books/
│   │   └── prisma/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── types/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.ts
- PostgreSQL: Change port in docker-compose.yml

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

### Migration Issues
```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma migrate dev
npm run prisma:seed
```

## Next Steps

1. Explore the Dashboard
2. Create authors and books
3. Test borrowing functionality
4. Check the API documentation in README.md
5. Customize the UI to your needs

Enjoy building with the Library Management System! 📚
