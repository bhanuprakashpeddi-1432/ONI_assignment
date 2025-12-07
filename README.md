# Library Management System 📚

A complete full-stack library management application with Docker deployment, built using modern technologies and best practices.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin/User)
- **Book Management**: Complete CRUD operations for books with author relationships
- **Author Management**: Manage author information and their books
- **Book Borrowing System**: Track borrowed books with due dates and return status
- **Responsive UI**: Modern React interface with intuitive design
- **Dockerized Deployment**: Production-ready Docker setup with multi-stage builds

## 🛠️ Tech Stack

### Backend
- **NestJS**: Progressive Node.js framework for building efficient server-side applications
- **Prisma 7**: Next-generation ORM with type-safe database access
- **PostgreSQL 16**: Robust relational database
- **JWT**: Secure authentication mechanism
- **bcrypt**: Password hashing

### Frontend
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Axios**: Promise-based HTTP client
- **React Router**: Client-side routing
- **Nginx**: Production web server and reverse proxy

### DevOps
- **Docker**: Containerization platform
- **Docker Compose**: Multi-container orchestration
- **Multi-stage builds**: Optimized production images

## 📦 Getting Started with Docker (Recommended)

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.x or higher

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Omini
   ```

2. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api
   - Database: localhost:5433

### Test Credentials

**Admin Account:**
- Email: `admin@library.com`
- Password: `admin123`

**User Accounts:**
- Email: `john@example.com` | Password: `user123`
- Email: `jane@example.com` | Password: `user123`

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Build and start with fresh images
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Check service status
docker-compose ps

# Restart a service
docker-compose restart backend
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                       │
└────────────────────┬────────────────────────────────┘
                     │ HTTP :8080
                     ▼
┌─────────────────────────────────────────────────────┐
│            Frontend Container (Nginx)                │
│  - Serves React SPA                                  │
│  - Proxies /api requests to backend                  │
└────────────────────┬────────────────────────────────┘
                     │ Docker Network
                     ▼
┌─────────────────────────────────────────────────────┐
│            Backend Container (NestJS)                │
│  - REST API :3000                                    │
│  - JWT Authentication                                │
│  - Business Logic                                    │
└────────────────────┬────────────────────────────────┘
                     │ Docker Network
                     ▼
┌─────────────────────────────────────────────────────┐
│         Database Container (PostgreSQL)              │
│  - PostgreSQL 16                                     │
│  - Persistent Volume                                 │
│  - Port :5433                                        │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
.
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── books/          # Book management
│   │   ├── authors/        # Author management
│   │   ├── borrowed-books/ # Borrowing system
│   │   └── prisma/         # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Database seeding
│   │   └── migrations/     # Migration files
│   ├── Dockerfile          # Multi-stage backend build
│   └── package.json
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── services/      # API services
│   │   └── lib/           # Utilities (axios)
│   ├── nginx.conf         # Nginx configuration
│   ├── Dockerfile         # Multi-stage frontend build
│   └── package.json
│
└── docker-compose.yml     # Service orchestration
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. In Docker, these are set in `docker-compose.yml`:

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation

**Database:**
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name

## 🗄️ Database Schema

### Tables
- **User**: User accounts with roles (ADMIN/USER)
- **Author**: Book authors
- **Book**: Book catalog with availability status
- **BorrowedBook**: Borrowing records with due dates

### Relationships
- User → BorrowedBook (one-to-many)
- Book → BorrowedBook (one-to-many)
- Author → Book (one-to-many)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API routes with guards
- CORS enabled for frontend communication
- Nginx reverse proxy for additional security

## 🚢 Production Deployment

The Docker setup is production-ready with:

- **Multi-stage builds**: Minimized image sizes
- **Non-root users**: Enhanced security
- **Health checks**: Automatic service monitoring
- **Persistent volumes**: Data persistence across restarts
- **Optimized caching**: Faster builds with layer caching
- **Nginx optimization**: Gzip compression, caching headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Admin only)
- `PATCH /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get author by ID
- `POST /api/authors` - Create author (Admin only)
- `PATCH /api/authors/:id` - Update author (Admin only)
- `DELETE /api/authors/:id` - Delete author (Admin only)

### Borrowed Books
- `GET /api/borrowed-books` - Get all borrowed books
- `POST /api/borrowed-books` - Borrow a book
- `PATCH /api/borrowed-books/:id` - Return a book

## 🧪 Testing

The application includes test data with:
- 3 users (1 admin, 2 regular users)
- 3 authors
- 7 books across different genres

## 📝 Development Notes

### Prisma 7 Changes
This project uses Prisma 7, which has breaking changes:
- Database URL moved from `schema.prisma` to `prisma.config.ts`
- `url` field removed from datasource block in schema

### Docker Optimizations
- npm install used instead of npm ci (package-lock excluded)
- Separate build and production stages
- Minimal Alpine-based images
- Build-time Prisma generation with dummy DATABASE_URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Support

For issues or questions:
1. Check existing documentation
2. Review Docker logs: `docker-compose logs`
3. Verify all containers are running: `docker-compose ps`
4. Open an issue on GitHub

---

**Built with ❤️ using NestJS, React, and Docker**
