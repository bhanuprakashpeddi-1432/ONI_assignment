# 🚀 Deployment Guide

This guide covers how to deploy the **Library Management System** in a production environment.

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed on the target machine (VPS, AWS EC2, DigitalOcean Droplet, etc.).
- Basic understanding of command-line operations.

---

## 🏗️ Deployment Strategy

We use **Docker Compose** to orchestrate the three main services:
1.  **Postgres Database**: Persistent data storage.
2.  **NestJS Backend**: API server (Node.js).
3.  **React Frontend**: Static files served via **Nginx** reverse proxy.

### Architecture Notes
- The **Frontend** container (Nginx) runs on port `80` (HTTP).
- The **Backend** container runs on port `3000`.
- Nginx is configured to proxy requests from `/api` to the backend.
- The React app is built as static assets (`dist` folder).

---

## 🛠️ Step-by-Step Deployment

### 1. Clone the Repository
On your server:
```bash
git clone <repository-url>
cd library-management-system
```

### 2. Configure Environment Variables
Create a `.env` file (you can copy `.env.example` as a base, but use secure values):

```bash
# Database
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=library_prod_db

# Backend
DATABASE_URL="postgresql://myuser:mypassword@postgres:5432/library_prod_db?schema=public"
JWT_SECRET="complex_production_secret_key_change_this"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://your-domain.com" # Or http://localhost if testing locally

# Frontend
VITE_API_URL="http://your-domain.com/api" # Important: Point to Nginx /api
```

### 3. Run with Docker Compose (Production)
Use the dedicated production compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Verify Deployment
- Open your browser to `http://your-server-ip` or `http://your-domain.com`.
- The frontend should load.
- Try logging in (Seeded data: `admin@library.com` / `admin123`).

---

## ☁️ Alternative: Cloud Platform Deployment

If you prefer platforms like Railway, Render, or Vercel:

### Backend (Railway/Render)
1.  Connect your GitHub repo.
2.  Root Directory: `backend`.
3.  Build Command: `npm run build`.
4.  Start Command: `npm run start:prod`.
5.  **Environment Variables**: Set `DATABASE_URL`, `JWT_SECRET`, etc.

### Frontend (Vercel/Netlify)
1.  Connect your GitHub repo.
2.  Root Directory: `frontend`.
3.  Build Command: `npm run build`.
4.  Output Directory: `dist`.
5.  **Environment Variables**: Set `VITE_API_URL` to your deployed backend URL (e.g., `https://my-api.railway.app`).

### Database (Supabase/Neon)
1.  Create a Postgres database.
2.  Get the Connection String.
3.  Provide it to the Backend via `DATABASE_URL`.

---

## 🔄 Updating the Application

To deploy new changes:

1.  **Pull changes**:
    ```bash
    git pull origin main
    ```

2.  **Rebuild containers**:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```
    *Docker will detect changes, rebuild images, and recreate containers with minimal downtime.*
