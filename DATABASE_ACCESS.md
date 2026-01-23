# 🗄️ PostgreSQL Database Access Guide

## Your Database Credentials

### Connection Details:
- **Host**: `localhost`
- **Port**: `5432`
- **Database Name**: `asiabylocals`
- **Username**: `talhanawaz` (your macOS username)
- **Password**: None (local authentication uses your macOS user)
- **Schema**: `public`

### Connection String:
```
postgresql://talhanawaz@localhost:5432/asiabylocals?schema=public
```

## Method 1: Prisma Studio (Easiest - Visual GUI) ⭐ RECOMMENDED

**Prisma Studio** is a visual database browser built into Prisma. It's the easiest way to view and edit your data.

### Start Prisma Studio:
```bash
cd server
npm run prisma:studio
```

This will open a browser at `http://localhost:5555` where you can:
- ✅ View all tables
- ✅ Browse data
- ✅ Edit records
- ✅ Add new records
- ✅ Delete records
- ✅ Search and filter

**No password needed** - it uses your `.env` file automatically.

## Method 2: Command Line (psql)

### Connect to Database:
```bash
/opt/homebrew/opt/postgresql@16/bin/psql asiabylocals
```

### Useful Commands:
```sql
-- List all tables
\dt

-- View table structure
\d suppliers
\d tours
\d bookings

-- View all data in a table
SELECT * FROM suppliers;
SELECT * FROM tours;
SELECT * FROM bookings;

-- Count records
SELECT COUNT(*) FROM suppliers;
SELECT COUNT(*) FROM tours;

-- Exit psql
\q
```

### Quick Queries:
```bash
# View all suppliers
/opt/homebrew/opt/postgresql@16/bin/psql asiabylocals -c "SELECT id, email, full_name, status FROM suppliers;"

# View all tours
/opt/homebrew/opt/postgresql@16/bin/psql asiabylocals -c "SELECT id, title, city, status FROM tours;"

# View all bookings
/opt/homebrew/opt/postgresql@16/bin/psql asiabylocals -c "SELECT id, customer_name, customer_email, total_amount, status FROM bookings;"
```

## Method 3: GUI Tools (Third-Party)

### Option A: pgAdmin (Full-Featured)
1. Download: https://www.pgadmin.org/download/
2. Install and open
3. Add new server:
   - **Name**: AsiaByLocals Local
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: asiabylocals
   - **Username**: talhanawaz
   - **Password**: (leave empty)

### Option B: TablePlus (Beautiful UI - macOS)
1. Download: https://tableplus.com/
2. Install and open
3. Click "Create a new connection"
4. Select PostgreSQL
5. Enter:
   - **Name**: AsiaByLocals
   - **Host**: localhost
   - **Port**: 5432
   - **User**: talhanawaz
   - **Database**: asiabylocals
   - **Password**: (leave empty)

### Option C: DBeaver (Free, Cross-Platform)
1. Download: https://dbeaver.io/download/
2. Install and open
3. New Database Connection → PostgreSQL
4. Enter connection details above

### Option D: Postico (macOS Native)
1. Download: https://eggerapps.at/postico/
2. Install and open
3. Create new favorite:
   - **Host**: localhost
   - **Port**: 5432
   - **User**: talhanawaz
   - **Database**: asiabylocals

## Quick Reference

### Check Database Status:
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# List all databases
/opt/homebrew/opt/postgresql@16/bin/psql postgres -c "\l"

# List all tables
/opt/homebrew/opt/postgresql@16/bin/psql asiabylocals -c "\dt"
```

### Backup Database:
```bash
# Create backup
/opt/homebrew/opt/postgresql@16/bin/pg_dump asiabylocals > backup.sql

# Restore backup
/opt/homebrew/opt/postgresql@16/bin/psql asiabylocals < backup.sql
```

### Reset Database (WARNING: Deletes all data):
```bash
cd server
npx prisma migrate reset
```

## Your Current Tables:

1. **suppliers** - Supplier accounts and profiles
2. **tours** - Tour listings
3. **tour_options** - Tour pricing options
4. **bookings** - Customer bookings
5. **messages** - Chat messages (if using chat feature)
6. **_prisma_migrations** - Migration history

## Security Note:

Since you're using local authentication (no password), only users on your Mac can access the database. For production, you'll need to:
- Set a password
- Use environment variables
- Restrict access via firewall
- Use SSL connections

---

**Recommended**: Start with **Prisma Studio** - it's the easiest and requires no setup!



