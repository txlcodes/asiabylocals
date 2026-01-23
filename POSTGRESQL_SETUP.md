# 🐘 PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### macOS (using Homebrew):
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
```

### Alternative: PostgreSQL.app (macOS GUI)
1. Download from: https://postgresapp.com/
2. Install and launch
3. Click "Initialize" to create a new server
4. PostgreSQL will run on port 5432

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user

## Step 2: Create Database

### Option A: Using psql command line
```bash
# Connect to PostgreSQL (default user is your macOS username, or 'postgres' on Linux/Windows)
psql postgres

# Or if that doesn't work, try:
psql -U postgres
```

Once connected, run:
```sql
-- Create database
CREATE DATABASE asiabylocals;

-- Create a user (optional, but recommended)
CREATE USER asiabylocals_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE asiabylocals TO asiabylocals_user;

-- Exit psql
\q
```

### Option B: Using PostgreSQL.app (macOS)
1. Open PostgreSQL.app
2. Click "Open psql"
3. Run the SQL commands above

## Step 3: Update Prisma Schema

Edit `server/prisma/schema.prisma`:

**Change from:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**To:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 4: Set Up Environment Variable

Create or update `server/.env`:

```env
# PostgreSQL Connection String
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Local development example:
DATABASE_URL="postgresql://asiabylocals_user:your_secure_password@localhost:5432/asiabylocals?schema=public"

# Or if using default postgres user:
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/asiabylocals?schema=public"

# Or if no password (local macOS):
DATABASE_URL="postgresql://$(whoami)@localhost:5432/asiabylocals?schema=public"
```

**Important:** Replace:
- `asiabylocals_user` with your PostgreSQL username
- `your_secure_password` with your PostgreSQL password
- `asiabylocals` with your database name

## Step 5: Install PostgreSQL Client for Prisma

```bash
cd server
npm install
```

Prisma will automatically use the PostgreSQL driver when you change the schema.

## Step 6: Generate Prisma Client

```bash
cd server
npm run prisma:generate
```

This will generate the Prisma Client for PostgreSQL.

## Step 7: Run Migrations

```bash
cd server

# Create initial migration for PostgreSQL
npx prisma migrate dev --name init_postgresql

# This will:
# 1. Create all tables in PostgreSQL
# 2. Apply all migrations
# 3. Generate Prisma Client
```

## Step 8: Verify Connection

```bash
cd server

# Open Prisma Studio to view your database
npm run prisma:studio
```

This will open a browser at `http://localhost:5555` where you can see your database tables.

## Step 9: Test the Server

```bash
cd server
npm run dev
```

The server should start and connect to PostgreSQL instead of SQLite.

## Troubleshooting

### "psql: command not found"
- Make sure PostgreSQL is installed and added to PATH
- On macOS: `brew services start postgresql@16`
- Try: `which psql` to find the path

### "password authentication failed"
- Check your `.env` file has the correct password
- Try connecting manually: `psql -U postgres -d asiabylocals`

### "database does not exist"
- Make sure you created the database (Step 2)
- Check the database name in `DATABASE_URL` matches

### "connection refused"
- Make sure PostgreSQL is running:
  - macOS: `brew services list` (should show "started")
  - Linux: `sudo systemctl status postgresql`
  - Windows: Check Services panel

### Migration errors
- If you have existing SQLite data, you'll need to export and import it
- For fresh start, you can drop and recreate:
  ```sql
  DROP DATABASE asiabylocals;
  CREATE DATABASE asiabylocals;
  ```

## Quick Commands Reference

```bash
# Start PostgreSQL (macOS)
brew services start postgresql@16

# Stop PostgreSQL (macOS)
brew services stop postgresql@16

# Connect to database
psql -U postgres -d asiabylocals

# List all databases
psql -U postgres -c "\l"

# List all tables
psql -U postgres -d asiabylocals -c "\dt"

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Next Steps

After PostgreSQL is set up:
1. ✅ Update `server/prisma/schema.prisma` to use `postgresql`
2. ✅ Set `DATABASE_URL` in `server/.env`
3. ✅ Run `npm run prisma:generate`
4. ✅ Run `npx prisma migrate dev`
5. ✅ Test your server

Your app is now ready for production! 🎉



