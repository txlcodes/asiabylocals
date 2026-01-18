# 🔧 Fix Render Build Command - Step by Step

## Issue
The Build Command field shows `./ $` prefix and has syntax errors, making "Save Changes" disabled.

## Solution

### Step 1: Click "Edit" Button
- Look for the **pencil icon (✏️)** or **"Edit"** button next to the Build Command field
- Click it to unlock the field for editing

### Step 2: Clear and Replace Build Command
1. **Select ALL text** in the Build Command field (including `./ $`)
2. **Delete everything**
3. **Paste this exact command:**
   ```
   npm install && npm run build && cd server && npm install && npm run prisma:generate
   ```
   - NO `./ $` prefix
   - NO double `&& &&`
   - Complete: `prisma:generate` (not `prisma:g`)

### Step 3: Fix Start Command
1. Click **"Edit"** button next to Start Command
2. **Select ALL text** (including `./ $`)
3. **Delete everything**
4. **Paste:**
   ```
   cd server && npm start
   ```

### Step 4: Clear Pre-Deploy Command (Optional)
1. Click **"Edit"** button next to Pre-Deploy Command
2. **Delete** the `./ $` text
3. **Leave it EMPTY** (it's optional)

### Step 5: Save
- After fixing all commands, the **"Save Changes"** button should become active
- Click it to save

## Alternative: If "Edit" Button Doesn't Work

If you can't find the Edit button or it's not working:

1. **Try clicking directly in the input field** - it might be editable
2. **Try double-clicking** the field
3. **Check if there's a lock icon** - click it to unlock
4. **Try refreshing the page** and editing again

## Correct Commands Summary:

**Build Command:**
```
npm install && npm run build && cd server && npm install && npm run prisma:generate
```

**Start Command:**
```
cd server && npm start
```

**Pre-Deploy Command:**
```
(leave empty)
```

---

**After saving, Render will automatically redeploy!** 🚀

