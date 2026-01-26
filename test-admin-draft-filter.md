# Test: Admin Dashboard Draft Filter

## Expected Behavior

When "Pending" filter is selected:
- ✅ Should show ONLY tours with `status: 'pending'`
- ❌ Should NOT show tours with `status: 'draft'`

## How to Test

1. **Open Admin Panel:**
   - URL: `https://asiabylocals.onrender.com/secure-panel-abl`
   - Login with admin credentials

2. **Check Tours Tab:**
   - Click on "Tours" tab
   - Verify "Pending" filter is selected (yellow button)

3. **Verify Results:**
   - Look at the tour list
   - Check the status badge on each tour
   - Should see "⏳ PENDING" badges
   - Should NOT see any "Draft" badges

4. **Test Draft Filter:**
   - Click "Draft" filter button (blue)
   - Should show ONLY draft tours
   - Should NOT show pending tours

## Backend Verification

The endpoint `/api/admin/tours/pending` filters correctly:
```javascript
where: {
  status: 'pending'  // Only pending, excludes drafts
}
```

## Frontend Verification

When `tourFilter === 'pending'`:
- Uses: `/api/admin/tours/pending` ✅
- This endpoint only returns pending tours ✅

When `tourFilter === 'draft'`:
- Uses: `/api/admin/tours?status=draft` ✅
- This endpoint returns draft tours ✅

## If Drafts Still Appear

If drafts are showing in the "Pending" filter:
1. Check browser console for API response
2. Verify the endpoint being called
3. Check if tours have incorrect status in database
