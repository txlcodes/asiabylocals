# 🚀 Start Backend with Visible Logs

## Step-by-Step Instructions

### Option 1: Use Cursor's Integrated Terminal (Easiest!)

1. **Open Terminal in Cursor:**
   - Press `` Ctrl+` `` (backtick) or `Cmd+J` (Mac)
   - Or go to: **Terminal → New Terminal**

2. **Navigate to server folder:**
   ```bash
   cd server
   ```

3. **Start the backend:**
   ```bash
   npm start
   ```

4. **You'll see logs immediately!** 
   - All errors will appear in this terminal
   - Keep this terminal visible while testing

### Option 2: Use External Terminal

1. **Open Terminal app** (Mac) or Command Prompt (Windows)

2. **Navigate to project:**
   ```bash
   cd /Users/talhanawaz/Desktop/asiabylocals/server
   ```

3. **Start backend:**
   ```bash
   npm start
   ```

4. **Keep terminal visible** - errors appear here!

## 🎯 What You'll See

When you run `npm start`, you'll see:

```
> asiabylocals-server@1.0.0 start
> node server.js

📧 Using Resend SDK for email delivery
✅ Resend SDK initialized
🚀 Server running on http://localhost:3001
✅ Connected to database via Prisma
```

**Then when you submit a tour, errors appear like:**

```
═══════════════════════════════════════════════════════════
🚨 TOUR CREATION ERROR DETECTED 🚨
═══════════════════════════════════════════════════════════
❌ Attempt 1/3 failed

📋 ERROR DETAILS:
   Message: The column `pricing_type` does not exist...
   Code: P2022
```

## 💡 Pro Tips

- **Keep terminal visible** - don't minimize it
- **Split screen**: Terminal on left, Browser on right
- **Watch for red text** - that's your error!
- **Don't close terminal** - that stops the server

## 🛑 To Stop Server

Press `Ctrl+C` in the terminal

## 🔄 Restart After Changes

1. Stop server: `Ctrl+C`
2. Make changes to `server.js`
3. Start again: `npm start`
4. Test immediately!

---

**Ready? Open terminal and run `npm start` in the server folder!** 🚀

