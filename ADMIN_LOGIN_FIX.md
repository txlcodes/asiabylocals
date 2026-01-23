# 🔐 Admin Panel Login Fix

## Correct Credentials

Based on your Render environment variables:

- **Username**: `admin`
- **Password**: `AsiaByLocals2026!Secure`

**NOT** `admin123` - that's just the default fallback if env vars aren't set.

## How to Access

1. Go to: `https://www.asiabylocals.com/admin`
2. Enter:
   - Username: `admin`
   - Password: `AsiaByLocals2026!Secure`
3. Click "Sign In"

## Debugging

If login still fails:

### Step 1: Check Browser Console
Open browser DevTools (F12) → Console tab
Look for:
```
🔐 Admin login attempt:
   API URL: https://www.asiabylocals.com/api/admin/login
   Username: admin
   Password length: 23
   Response status: 401
```

### Step 2: Check Render Logs
Go to Render Dashboard → Your Service → Logs
Look for:
```
🔐 Admin login attempt:
   Username received: admin
   Password length: 23
   Expected username: admin
   Expected password length: 23
   Username match: true/false
   Password match: true/false
```

### Step 3: Verify Environment Variables
In Render Dashboard → Your Service → Environment:
- `ADMIN_USERNAME` should be: `admin`
- `ADMIN_PASSWORD` should be: `AsiaByLocals2026!Secure`

## Common Issues

### Issue 1: Wrong Password
- **Symptom**: "Username or password is incorrect"
- **Fix**: Use `AsiaByLocals2026!Secure` (not `admin123`)

### Issue 2: API URL Wrong
- **Symptom**: "Cannot connect to server"
- **Fix**: Check `VITE_API_URL` in frontend env vars

### Issue 3: CORS Error
- **Symptom**: Network error in browser console
- **Fix**: Check CORS settings in `server.js`

### Issue 4: Environment Variables Not Set
- **Symptom**: Login fails even with correct password
- **Fix**: Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` to Render

## Test After Fix

After deploying the enhanced logging:

1. Try logging in with correct credentials
2. Check browser console for detailed logs
3. Check Render logs for backend logs
4. Share the logs if it still doesn't work

The enhanced logging will show exactly what's happening!

