# 🗄️ Database Connection Information

## Your Render PostgreSQL Database

### Internal Database URL (Use for Render Services)
```
postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a/asiabylocals
```

**Use this URL when:**
- ✅ Backend API is deployed on Render (same network)
- ✅ Faster connection (no internet routing)
- ✅ More secure (internal network)

### External Database URL (Use for Local Development)
```
postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals
```

**Use this URL when:**
- ✅ Connecting from your local machine
- ✅ Using Prisma Studio locally
- ✅ Running migrations from your computer
- ✅ Testing database connection

## Connection Details

- **Host**: `dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com`
- **Port**: `5432` (default PostgreSQL port)
- **Database**: `asiabylocals`
- **Username**: `asiabylocals_user`
- **Password**: `L557HX73Pj8SyhOkztLjJvCwsBOJkHZv`
- **Region**: Oregon, USA

## PSQL Command (Command Line)

To connect via command line:

```bash
PGPASSWORD=L557HX73Pj8SyhOkztLjJvCwsBOJkHZv psql -h dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com -U asiabylocals_user asiabylocals
```

## Prisma Connection String

For local development, update `server/.env`:

```env
DATABASE_URL="postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals"
```

Then run:
```bash
cd server
npx prisma generate
npx prisma migrate deploy
```

## Render Environment Variable

In Render Dashboard → Your Web Service → Environment:

```env
DATABASE_URL=postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a/asiabylocals
```

**Note**: Use the INTERNAL URL (without `.oregon-postgres.render.com`) for Render services.

## Testing Connection

### From Local Machine:

```bash
# Test connection
psql "postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals" -c "SELECT version();"

# Or use Prisma Studio
cd server
npx prisma studio
```

### From Render:

The backend API will automatically connect using the `DATABASE_URL` environment variable.

## Security Notes

⚠️ **Important:**
- Never commit database credentials to GitHub
- Use environment variables only
- The `.gitignore` already excludes `.env` files
- Change password periodically in Render dashboard

## Database Management

### View Database in Render:
1. Go to Render Dashboard
2. Click on your PostgreSQL service
3. Click "Connect" tab
4. View connection details

### Access via Prisma Studio:
```bash
cd server
DATABASE_URL="postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals" npx prisma studio
```

### Run Migrations:
```bash
cd server
DATABASE_URL="postgresql://asiabylocals_user:L557HX73Pj8SyhOkztLjJvCwsBOJkHZv@dpg-d5m8nsngi27c739d4fe0-a.oregon-postgres.render.com/asiabylocals" npx prisma migrate deploy
```

---

**Your database is ready!** Use the appropriate URL based on where you're connecting from.

