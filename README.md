# 📚 Library Management System - Full-Stack Intern Assignment

A complete full-stack library management system built with **NestJS**, **PostgreSQL**, **Prisma**, and **React** (TypeScript). This project demonstrates modern web development practices with containerized deployment and production-ready architecture.

---

## 🎯 Assignment Overview

This project fulfills the Full-Stack Intern Assignment requirements:

✅ **Backend**: NestJS with Prisma ORM and PostgreSQL  
✅ **Frontend**: React.js with TypeScript  
✅ **Authentication**: JWT-based security  
✅ **Containerization**: Docker & Docker Compose  
✅ **API Design**: RESTful architecture  
✅ **Bonus Features**: Dockerized environment, advanced filtering, clean UI, proper state management

---

## 📋 Assignment Compliance Matrix

| Requirement | Status | Implementation Details |
|------------|:------:|------------------------|
| **Backend** | ✅ | NestJS (TypeScript) with modular architecture |
| **Database** | ✅ | PostgreSQL 16 with Prisma ORM |
| **Frontend** | ✅ | React 18 (TypeScript) with Vite |
| **Books CRUD** | ✅ | Full CRUD with filters (author, availability, search) |
| **Authors CRUD** | ✅ | Complete CRUD operations with cascade delete |
| **Users CRUD** | ✅ | Create and list users with role-based access |
| **Borrowing System** | ✅ | Borrow, return, and list borrowed books |
| **JWT Authentication** | ✅ | Secure JWT implementation with guards |
| **REST API** | ✅ | RESTful endpoints with proper HTTP methods |
| **Containerization** | ✅ | Docker + Docker Compose with multi-stage builds |
| **Environment Config** | ✅ | `.env` files with `.env.example` provided |
| **Swagger/OpenAPI** | ✅ | API documentation available |
| **Advanced Filtering** | ✅ | Search, author filter, availability status |
| **Clean UI** | ✅ | Modern, responsive design with smooth UX |
| **State Management** | ✅ | React Context API for authentication |
| **Documentation** | ✅ | Comprehensive README with setup instructions |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) v10 (Node.js/TypeScript)
- **ORM**: [Prisma](https://www.prisma.io/) v7.1.0
- **Database**: PostgreSQL 16
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer

### Frontend
- **Library**: [React](https://react.dev/) v18
- **Language**: TypeScript v5
- **Build Tool**: [Vite](https://vitejs.dev/) v5
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Web Server**: Nginx (production)

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose v2
- **Reverse Proxy**: Nginx
- **CI/CD Ready**: Production-optimized Dockerfiles

---

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.x or higher
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/bhanuprakashpeddi-1432/ONI_assignment.git
cd ONI_assignment
```

### Step 2: Start All Services
```bash
docker-compose up -d --build
```

This command will:
- Build backend and frontend Docker images
- Start PostgreSQL database container
- Run database migrations automatically
- Seed the database with test data
- Start all services

### Step 3: Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Database**: localhost:5433

### Step 4: Login with Test Credentials

**Admin Account:**
- Email: `admin@library.com`
- Password: `admin123`

**Regular User Accounts:**
- Email: `john@example.com` | Password: `user123`
- Email: `jane@example.com` | Password: `user123`

---

## 🔧 Running Without Docker

### Prerequisites
- Node.js v18+ and npm
- PostgreSQL 16+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/library_db"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run start:dev
   ```
   
   Backend will run on http://localhost:3000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on http://localhost:5173

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│                 http://localhost:8080                    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Frontend Container (Nginx)                    │
│  - React 18 SPA (TypeScript)                            │
│  - Vite Build System                                     │
│  - Proxies /api → backend                                │
│  - Port: 8080                                            │
└────────────────────────┬────────────────────────────────┘
                         │ Docker Network (omini-network)
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Backend Container (NestJS)                    │
│  - REST API Endpoints                                    │
│  - JWT Authentication & Authorization                    │
│  - Business Logic Layer                                  │
│  - Prisma ORM Client                                     │
│  - Port: 3000                                            │
└────────────────────────┬────────────────────────────────┘
                         │ Prisma Client Connection
                         ▼
┌─────────────────────────────────────────────────────────┐
│         Database Container (PostgreSQL 16)               │
│  - Persistent Volume (postgres_data)                     │
│  - Tables: User, Author, Book, BorrowedBook             │
│  - Port: 5433 → 5432                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
.
├── backend/                     # NestJS Backend Application
│   ├── src/
│   │   ├── auth/               # Authentication Module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/         # JWT & Role Guards
│   │   │   └── strategies/     # JWT Strategy
│   │   ├── users/              # User Management Module
│   │   ├── books/              # Book Management Module
│   │   ├── authors/            # Author Management Module
│   │   ├── borrowed-books/     # Borrowing System Module
│   │   └── prisma/             # Prisma Service Module
│   ├── prisma/
│   │   ├── schema.prisma       # Database Schema Definition
│   │   ├── seed.ts             # Database Seeding Script
│   │   └── migrations/         # Database Migration Files
│   ├── Dockerfile              # Multi-stage Backend Build
│   ├── package.json
│   └── .env.example
│
├── frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── pages/              # Page Components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/         # Reusable Components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/            # React Context (Global State)
│   │   │   └── AuthContext.tsx
│   │   ├── services/           # API Service Layer
│   │   │   └── api.ts
│   │   ├── lib/                # Utilities & Config
│   │   │   └── axios.ts
│   │   └── types/              # TypeScript Type Definitions
│   ├── nginx.conf              # Nginx Reverse Proxy Config
│   ├── Dockerfile              # Multi-stage Frontend Build
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml           # Service Orchestration
└── README.md                    # This File
```

---

## 🗄️ Database Schema

### Prisma Models

```prisma
model User {
  id             Int            @id @default(autoincrement())
  email          String         @unique
  password       String
  name           String
  role           Role           @default(USER)
  borrowedBooks  BorrowedBook[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model Author {
  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  books     Book[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Book {
  id             Int            @id @default(autoincrement())
  title          String
  isbn           String         @unique
  publishedYear  Int
  availableCopies Int
  totalCopies    Int
  author         Author         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId       Int
  borrowedBooks  BorrowedBook[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model BorrowedBook {
  id          Int       @id @default(autoincrement())
  borrowDate  DateTime  @default(now())
  dueDate     DateTime
  returnDate  DateTime?
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
  book        Book      @relation(fields: [bookId], references: [id])
  bookId      Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

### Entity Relationships

- **User ↔ BorrowedBook**: One-to-Many (A user can borrow multiple books)
- **Book ↔ BorrowedBook**: One-to-Many (A book can have multiple borrow records)
- **Author ↔ Book**: One-to-Many (An author can write multiple books)
- **Cascade Delete**: Deleting an author removes all their books

---

## 📊 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

**Example Login Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'
```

**Example Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@library.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

### Books Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | List all books with filters | No |
| GET | `/api/books/:id` | Get book by ID | No |
| POST | `/api/books` | Create new book | Admin only |
| PATCH | `/api/books/:id` | Update book details | Admin only |
| DELETE | `/api/books/:id` | Delete a book | Admin only |

**Query Parameters for GET /api/books:**
- `search`: Search in title or ISBN
- `authorId`: Filter by author ID
- `available`: Filter by availability (true/false)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/books?search=Harry&available=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Authors Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/authors` | List all authors | No |
| GET | `/api/authors/:id` | Get author by ID | No |
| POST | `/api/authors` | Create new author | Admin only |
| PATCH | `/api/authors/:id` | Update author details | Admin only |
| DELETE | `/api/authors/:id` | Delete an author | Admin only |

### Users Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | List all users | Admin only |
| POST | `/api/users` | Create new user | No (via register) |

### Borrowed Books Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/borrowed-books` | List all borrowed books | Yes |
| POST | `/api/borrowed-books` | Borrow a book | Yes |
| PATCH | `/api/borrowed-books/:id` | Return a borrowed book | Yes |

**Example Borrow Request:**
```bash
curl -X POST http://localhost:3000/api/borrowed-books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1, "dueDate": "2025-12-31"}'
```

---

## 🔒 Authentication & Authorization

### JWT Implementation

- **Token Generation**: On successful login, server generates JWT with user payload
- **Token Storage**: Frontend stores token in localStorage
- **Token Usage**: Sent in `Authorization: Bearer <token>` header for protected routes
- **Token Expiration**: Configurable via JWT_SECRET in environment

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **USER** | View books/authors, Borrow/return books |
| **ADMIN** | All USER permissions + Create/Edit/Delete books/authors |

### Protected Routes

All write operations (POST, PATCH, DELETE) require authentication. Admin-only operations are protected with `@Roles('ADMIN')` decorator.

---

## 🐳 Docker Configuration

### Docker Compose Services

```yaml
services:
  postgres:    # PostgreSQL Database
    - Port: 5433:5432
    - Health checks enabled
    - Persistent volume

  backend:     # NestJS API
    - Port: 3000
    - Depends on postgres
    - Auto-runs migrations

  frontend:    # React + Nginx
    - Port: 8080
    - Proxies /api to backend
```

### Useful Docker Commands

```bash
# Start all services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: deletes database)
docker-compose down -v

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm run seed
docker-compose exec postgres psql -U postgres -d library_db
```

---

## 🧪 Testing the API

### Using cURL

```bash
# 1. Login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}' \
  | jq -r '.access_token')

# 2. Get all books
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a new book (Admin only)
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "isbn": "1234567890",
    "publishedYear": 2025,
    "authorId": 1,
    "totalCopies": 5
  }'

# 4. Borrow a book
curl -X POST http://localhost:3000/api/borrowed-books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1, "dueDate": "2025-12-31"}'
```

### Using Swagger UI

Visit http://localhost:3000/api/docs for interactive API documentation.

---

## 🎨 Frontend Features

### Pages & Functionality

1. **Login Page** (`/`)
   - JWT authentication
   - Form validation
   - Error handling

2. **Register Page** (`/register`)
   - New user registration
   - Password validation
   - Automatic login after registration

3. **Dashboard** (`/dashboard`)
   - Books management (CRUD for admins, view for users)
   - Authors management (CRUD for admins)
   - Borrowing system (borrow/return books)
   - Advanced filtering (search, author, availability)
   - Role-based UI rendering

### State Management

- **AuthContext**: Global authentication state
  - Current user information
  - JWT token management
  - Login/logout functionality
  - Protected route handling

### UI/UX Features

- Modern, clean design with gradient backgrounds
- Responsive layout (mobile-friendly)
- Loading states and error handling
- Form validation with user feedback
- Smooth transitions and hover effects
- Toast notifications for user actions

---

## 📝 Database Seeding

The project includes pre-populated test data:

### Seeded Users
- **Admin**: admin@library.com / admin123
- **User 1**: john@example.com / user123
- **User 2**: jane@example.com / user123

### Seeded Authors
- J.K. Rowling
- George Orwell
- Jane Austen

### Seeded Books
- Harry Potter and the Philosopher's Stone
- 1984
- Animal Farm
- Pride and Prejudice
- Emma
- Sense and Sensibility
- The Hobbit

To re-seed the database:
```bash
# With Docker
docker-compose exec backend npm run seed

# Without Docker
cd backend
npm run seed
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@postgres:5432/library_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server Configuration
PORT=3000
```

### Frontend (.env)

```env
# API Base URL
VITE_API_URL=http://localhost:3000

# Or for Docker
VITE_API_URL=/api
```

---

## 🚢 Production Deployment Considerations

### Backend
- Set strong JWT_SECRET
- Use production database (not Docker volume)
- Enable CORS for specific origins
- Configure rate limiting
- Set up logging and monitoring
- Use environment-specific configurations

### Frontend
- Build optimized production bundle
- Configure proper nginx caching
- Enable gzip compression
- Set up CDN for static assets
- Configure proper CORS headers

### Database
- Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Set up automated backups
- Configure connection pooling
- Enable SSL connections
- Monitor query performance

---

## 🎯 Design Decisions & Assumptions

### Architecture Decisions

1. **Modular NestJS Structure**: Each entity (Books, Authors, Users) has its own module for separation of concerns
2. **Prisma ORM**: Type-safe database access with migrations and automatic client generation
3. **JWT Authentication**: Stateless authentication suitable for REST APIs
4. **React Context API**: Lightweight state management for authentication (no external library needed)
5. **Docker Multi-stage Builds**: Optimized production images with minimal size
6. **Nginx Reverse Proxy**: Single entry point for frontend and API in production

### Business Logic Assumptions

1. **Book Availability**: Tracked by `availableCopies` count; decrements on borrow, increments on return
2. **Borrow Duration**: Default 14 days, can be customized via `dueDate` parameter
3. **User Roles**: Two roles (USER, ADMIN); admins have full CRUD access
4. **ISBN Uniqueness**: Each book must have a unique ISBN
5. **Author Deletion**: Cascade deletes all books by that author (admin decision required)
6. **Borrowed Books**: Users can view only their own borrowed books; admins see all

### Technical Assumptions

1. **Node.js Version**: Requires Node 20+ for optimal performance
2. **Docker**: Assumes Docker Desktop or Docker Engine is properly configured
3. **Port Availability**: Assumes ports 3000, 5433, and 8080 are available
4. **Database**: PostgreSQL 16+ for best Prisma compatibility

---

## 🤔 Troubleshooting

### Common Issues

**Issue**: Docker build fails with "npm ci" error  
**Solution**: The Dockerfiles use `npm install` instead of `npm ci` because package-lock.json is excluded

**Issue**: Prisma schema validation error about `url` field  
**Solution**: Prisma 7 moved database URL to `prisma.config.ts`; schema is already configured correctly

**Issue**: Frontend can't connect to backend  
**Solution**: Check that baseURL in `frontend/src/lib/axios.ts` is set to `/api` for Docker or `http://localhost:3000` for local dev

**Issue**: Database connection refused  
**Solution**: Ensure PostgreSQL is running and DATABASE_URL is correct

**Issue**: JWT token expired  
**Solution**: Login again to get a fresh token

### Logs & Debugging

```bash
# View all logs
docker-compose logs -f

# Backend logs only
docker-compose logs -f backend

# Database logs
docker-compose logs -f postgres

# Check container status
docker-compose ps

# Access backend container shell
docker-compose exec backend sh

# Access database
docker-compose exec postgres psql -U postgres -d library_db
```

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 👨‍💻 Development Notes

### Code Quality
- TypeScript strict mode enabled
- ESLint configured for code consistency
- Proper error handling throughout application
- Input validation using class-validator
- Clean separation of concerns

### Security Features
- Password hashing with bcrypt (10 rounds)
- JWT token validation on protected routes
- Role-based authorization guards
- Input sanitization and validation
- CORS configuration for API security

### Performance Optimizations
- Multi-stage Docker builds (smaller images)
- Nginx gzip compression enabled
- Database indexing on frequently queried fields
- Connection pooling for database
- Frontend code splitting with Vite

---

## 📄 License

MIT License - This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

This project was built as part of the Full-Stack Intern Assignment for demonstrating proficiency in:
- Modern TypeScript development
- Full-stack application architecture
- Database design and ORM usage
- RESTful API design
- Authentication and authorization
- Containerization and deployment
- Clean code practices and documentation

---

## 📞 Contact & Support

For questions or issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review Docker logs: `docker-compose logs -f`
3. Verify all containers are running: `docker-compose ps`
4. Open an issue on GitHub

---

**Built with ❤️ using NestJS, React, PostgreSQL, Prisma, and Docker**
