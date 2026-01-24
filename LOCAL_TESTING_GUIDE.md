# Local Testing Guide

## Why Test Locally First?

✅ **Instant feedback** - See errors in seconds, not 3-4 minutes  
✅ **Faster iteration** - Fix and test immediately  
✅ **No deployment wait** - Test before pushing to GitHub  
✅ **Better debugging** - See full error stack traces  

## Quick Start

### 1. Start the Backend Server

```bash
cd server
npm install
npm run prisma:generate
npm start
```

The server will run on `http://localhost:3001`

### 2. Start the Frontend (in a new terminal)

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:3000` (or similar)

### 3. Test Your Changes

1. Make changes to `server/server.js`
2. The server auto-restarts (if using `npm run dev` in server folder)
3. Test the API endpoint immediately
4. See errors instantly in the terminal

## Environment Variables

Make sure you have a `.env` file in the `server` folder with:

```env
DATABASE_URL="your_database_url"
PORT=3001
NODE_ENV=development
# ... other env vars
```

## Testing Tour Creation Locally

1. Open `http://localhost:3000` in your browser
2. Go to supplier dashboard
3. Try creating a tour
4. Check the terminal for errors immediately
5. Fix errors and test again - **no waiting!**

## Workflow Comparison

### ❌ Old Way (Slow)
1. Make changes
2. Commit & push to GitHub
3. Wait 3-4 minutes for Render deployment
4. See error
5. Fix and repeat (another 3-4 minutes)

**Total time per iteration: 6-8 minutes**

### ✅ New Way (Fast)
1. Make changes
2. Test locally (instant)
3. See error immediately
4. Fix and test again (instant)
5. Only push when it works

**Total time per iteration: seconds**

## Tips

- Keep both terminals open (backend + frontend)
- Use `npm run dev` in server folder for auto-restart
- Check terminal logs for detailed error messages
- Test with Postman/Thunder Client for API testing
- Use browser DevTools for frontend debugging

## When to Push

Only push to GitHub when:
- ✅ Tests pass locally
- ✅ No errors in terminal
- ✅ Tour creation works
- ✅ All features work as expected

This saves you hours of waiting!

