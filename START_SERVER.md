# 🚀 How to Start Your Backend Server

## Quick Start

Open a terminal and run:

```bash
cd /Users/talhanawaz/Desktop/asiabylocals-latest/server
node server.js
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 API endpoints available at http://localhost:3001/api
🗄️  Database: PostgreSQL via Prisma ORM
```

## Keep Server Running

**IMPORTANT:** Keep this terminal window open! If you close it, the server stops.

## Verify It's Working

1. Open in browser: `http://localhost:3001/api/health`
   - Should show: `{"status":"ok","message":"AsiaByLocals API is running","database":"connected"}`

2. Then refresh your city pages - tours should appear!

## Troubleshooting

If you see errors:
- **Database connection error**: Check your `.env` file has correct `DATABASE_URL`
- **Port already in use**: Another server is running on port 3001
- **Module not found**: Run `npm install` in the server directory first
