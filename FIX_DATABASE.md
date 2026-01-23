# 🔧 Fix Database - Tours Not Loading

## Issue: Tours don't load on frontend

This means either:
1. Database migrations haven't been run (tables don't exist)
2. Old data wasn't migrated from SQLite to PostgreSQL
3. Database is empty

## Step 1: Run Database Migrations

### In Render Shell:

1. Go to Render Dashboard → Your Backend Service (`asiabylocals`)
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd server
   npx prisma migrate deploy
   ```
4. This creates all tables in PostgreSQL

## Step 2: Check if Data Exists

After migrations, test if data exists:

**Test API:**
```
https://asiabylocals.onrender.com/api/public/tours?city=Agra&status=approved
```

If this returns empty `{"success":true,"tours":[]}`, then data needs to be migrated.

## Step 3: Migrate Old Data (If Needed)

If you had data in SQLite (`server/dev.db`), you need to migrate it:

### Option A: Run Migration Script Locally

1. On your local machine:
   ```bash
   cd server
   DATABASE_URL="postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals" node migrate-sqlite-to-postgres.js
   ```

2. This will copy all data from SQLite to PostgreSQL

### Option B: Start Fresh

If you don't have old data or want to start fresh:
- Just run migrations (Step 1)
- Create new tours through the supplier portal
- Approve them through admin panel

## Step 4: Verify Data

After migration, test again:
1. Visit frontend: `https://asiabylocals-frontend.onrender.com`
2. Click on a city
3. Tours should appear

## Quick Fix Right Now

**Run migrations first:**
1. Render Dashboard → Backend Service → Shell
2. Run: `cd server && npx prisma migrate deploy`
3. Wait for completion
4. Test frontend again

---

**Start with Step 1 (run migrations) - that's the most likely issue!**



