# AsiaByLocals Backend Server

Backend API server for AsiaByLocals supplier registration system using PostgreSQL with Prisma ORM.

## Tech Stack

- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/asiabylocals?schema=public"
   ```

3. **Initialize Prisma:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Create and run migrations
   npm run prisma:migrate
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### POST `/api/suppliers/register`
Register a new supplier.

**Request Body:**
```json
{
  "businessType": "company",
  "companyEmployees": "3 - 10",
  "companyActivities": "3 - 6",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "ABC Tours",
  "mainHub": "India",
  "city": "Mumbai",
  "tourLanguages": "English, Hindi"
}
```

### POST `/api/suppliers/login`
Login supplier.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET `/api/suppliers/:id`
Get supplier by ID.

### GET `/api/suppliers`
Get all suppliers with pagination.

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### PATCH `/api/suppliers/:id/status`
Update supplier status (admin).

**Request Body:**
```json
{
  "status": "approved"
}
```

## Database Schema

The schema is defined in `prisma/schema.prisma`. Key model:

- **Supplier** - Stores supplier registration data
  - Business type and details
  - Account information
  - Business details
  - Verification status

## Development

- Prisma Studio: `npm run prisma:studio` - Visual database browser
- Migrations: Edit `prisma/schema.prisma`, then run `npm run prisma:migrate`
- Logs: Prisma logs queries in development mode
