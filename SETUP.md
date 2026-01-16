# AsiaByLocals Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Database Setup

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database**
   ```bash
   # Start PostgreSQL service
   # macOS/Linux:
   brew services start postgresql
   # or
   sudo service postgresql start

   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE asiabylocals;

   # Exit psql
   \q
   ```

3. **Configure Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env` with your database credentials:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/asiabylocals?schema=public"
   PORT=3001
   NODE_ENV=development
   ```
   
   Replace `your_password` with your actual PostgreSQL password.

## Backend Setup

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Set up Prisma ORM**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run database migrations (creates tables)
   npm run prisma:migrate
   ```
   
   This will create the database schema automatically.

3. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:3001`

4. **Optional: Open Prisma Studio** (Database GUI)
   ```bash
   npm run prisma:studio
   ```
   
   This opens a visual database browser at `http://localhost:5555`

## Frontend Setup

1. **Install Frontend Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Public Endpoints
- `POST /api/suppliers/register` - Register new supplier
- `POST /api/suppliers/login` - Login supplier
- `GET /api/suppliers/:id` - Get supplier by ID
- `GET /api/health` - Health check

### Admin Endpoints
- `GET /api/suppliers` - Get all suppliers (with pagination)
  - Query params: `status`, `page`, `limit`
- `PATCH /api/suppliers/:id/status` - Update supplier status
  - Body: `{ "status": "pending" | "approved" | "rejected" }`

## Database Schema

The database schema is managed by Prisma ORM. The `suppliers` table includes:
- Business type and details
- Account information (name, email, hashed password)
- Business details (company name, location, languages)
- Verification status
- Timestamps

Schema is defined in `server/prisma/schema.prisma` and migrations are in `server/prisma/migrations/`.

## Troubleshooting

- **Database connection error**: Check PostgreSQL is running and credentials in `.env` are correct
- **Port already in use**: Change `PORT` in `server/.env`
- **CORS errors**: Ensure backend is running on port 3001

