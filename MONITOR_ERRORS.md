# 🔍 How to Monitor Errors Locally

## Method 1: View Backend Logs in Terminal

### Find the Terminal Running Backend:
1. Look for the terminal window where you ran `npm start` in the `server` folder
2. **All errors will appear there instantly** when you submit the form

### If you can't find it:
```bash
# Check which terminal has the backend
ps aux | grep "node.*server.js"

# View logs in real-time (if you have log files)
tail -f server/logs/*.log
```

## Method 2: Enhanced Error Display

The backend now logs errors with clear markers:
- ❌ = Error
- ⚠️ = Warning  
- ✅ = Success
- 📥 = Request received
- 🔍 = Debug info

## Method 3: Browser Console

1. **Open Browser DevTools**: Press `F12` or `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. **Frontend errors** will appear here
4. Go to **Network** tab to see API requests/responses

## Method 4: Check Specific Error Types

### Tour Creation Errors:
Look for these in terminal:
- `❌ Tour creation error`
- `❌ Prisma error`
- `P2022` = Column doesn't exist
- `P2002` = Unique constraint violation

### Common Error Patterns:
```
❌ Tour creation attempt X/3 failed
   Error code: P2022
   Error meta: { "modelName": "Tour", "column": "pricing_type" }
```

## Quick Debug Commands

```bash
# Restart backend with verbose logging
cd server
npm start

# Check if backend is running
curl http://localhost:3001/api/health

# Test tour creation endpoint directly
curl -X POST http://localhost:3001/api/tours \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Pro Tip: Split Terminal View

1. **Terminal 1**: Backend logs (`cd server && npm start`)
2. **Terminal 2**: Frontend logs (`npm run dev`)
3. **Browser**: Test the form

Watch all three simultaneously for complete error visibility!

