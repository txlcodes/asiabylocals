# Supplier Dashboard & Post-Login Features Plan

## ✅ Current Status

### Login System
- ✅ Login endpoint working (`/api/suppliers/login`)
- ✅ Email verification check before login
- ✅ Password hashing with bcrypt
- ✅ Supplier data stored in localStorage after login
- ✅ Login UI component created (`SupplierLogin.tsx`)
- ✅ Login button added to SupplierPage header

### Dashboard
- ✅ Dashboard component created (`SupplierDashboard.tsx`)
- ✅ Integrated with SupplierPage
- ✅ Auto-redirects to dashboard if supplier is logged in
- ✅ Logout functionality

---

## 📊 Dashboard Features (Current)

### 1. Overview Tab
- **Stats Cards:**
  - Total Activities count
  - Total Bookings (this month)
  - Total Earnings (all time)
- **Account Status:**
  - Account approval status badge (Pending/Approved/Rejected)
  - Email verification status

### 2. Activities Tab
- **Current:** Empty state with "Create Activity" button
- **Planned:** List of all activities with actions (View, Edit, Delete)

### 3. Bookings Tab
- **Current:** Empty state
- **Planned:** List of bookings with details (date, customer, status, earnings)

### 4. Earnings Tab
- **Current:** Empty state
- **Planned:** Earnings breakdown, charts, payment history

### 5. Profile Tab
- **Current:** Display supplier info (name, email, status)
- **Planned:** Edit profile, change password, update business details

---

## 🎯 Planned Features for Guides/Suppliers

### Phase 1: Activity Management (Priority 1)

#### 1.1 Create Activity
- **Form Fields:**
  - Activity title
  - Description (rich text editor)
  - Category (Cultural Tour, Food Tour, Adventure, etc.)
  - Location (City, Country)
  - Duration (hours)
  - Languages offered
  - Maximum group size
  - Price per person
  - Images upload (multiple)
  - Meeting point
  - What's included
  - What's not included
  - Cancellation policy
  - Availability calendar

#### 1.2 Activity List
- Display all activities in a grid/list view
- Status badges (Draft, Pending Review, Approved, Rejected)
- Quick actions (Edit, Duplicate, Delete, View)
- Filter by status
- Search functionality

#### 1.3 Activity Details/Edit
- Full activity editor
- Preview mode
- Save as draft
- Submit for review
- View activity on public site (if approved)

---

### Phase 2: Booking Management (Priority 2)

#### 2.1 Bookings List
- **Columns:**
  - Booking ID
  - Activity name
  - Customer name & email
  - Date & time
  - Number of guests
  - Total amount
  - Status (Confirmed, Completed, Cancelled)
  - Actions (View details, Contact customer, Cancel)

#### 2.2 Booking Details
- Full booking information
- Customer contact details
- Special requests/notes
- Payment status
- Cancellation history
- Communication log

#### 2.3 Booking Actions
- Accept/Reject booking
- Mark as completed
- Cancel booking (with reason)
- Send message to customer
- Export booking details

---

### Phase 3: Earnings & Payments (Priority 3)

#### 3.1 Earnings Dashboard
- **Overview:**
  - Total earnings (all time)
  - Earnings this month
  - Earnings this year
  - Pending payments
  - Next payout date

#### 3.2 Earnings Breakdown
- Earnings by activity
- Earnings by month (chart)
- Top performing activities
- Commission breakdown

#### 3.3 Payment History
- List of all payouts
- Payment method
- Transaction ID
- Status (Pending, Processing, Completed)
- Download invoices/receipts

#### 3.4 Payment Settings
- Bank account details
- Payment method selection
- Payout schedule preferences
- Tax information

---

### Phase 4: Profile & Settings (Priority 4)

#### 4.1 Profile Management
- Edit personal information
- Business details
- Profile photo
- Bio/About section
- Social media links
- Contact information

#### 4.2 Account Settings
- Change password
- Email preferences
- Notification settings
- Two-factor authentication
- Account deletion

#### 4.3 Business Settings
- Business type
- Tax ID/VAT number
- Business registration documents
- License/ID upload (already done in registration)
- Update business information

---

### Phase 5: Analytics & Insights (Priority 5)

#### 5.1 Activity Performance
- Views per activity
- Booking conversion rate
- Average rating
- Reviews count
- Revenue per activity

#### 5.2 Customer Insights
- Customer demographics
- Popular time slots
- Repeat customer rate
- Customer feedback summary

#### 5.3 Business Analytics
- Revenue trends
- Booking trends
- Seasonal patterns
- Growth metrics

---

### Phase 6: Communication (Priority 6)

#### 6.1 Messages
- Inbox for customer messages
- Reply to inquiries
- Message templates
- Notification badges

#### 6.2 Notifications
- New booking alerts
- Review notifications
- Payment notifications
- System updates
- Email notification preferences

---

## 🗄️ Database Schema Updates Needed

### Activities Table
```prisma
model Activity {
  id            Int      @id @default(autoincrement())
  supplierId    Int
  supplier      Supplier @relation(fields: [supplierId], references: [id])
  title         String
  description   String   @db.Text
  category      String
  location      String
  city          String
  country       String
  duration      Int      // in hours
  languages     String   // JSON array
  maxGroupSize  Int
  pricePerPerson Float
  images        String   // JSON array of image URLs
  meetingPoint  String
  included      String   @db.Text
  notIncluded   String   @db.Text
  cancellationPolicy String @db.Text
  status        String   @default("draft") // draft, pending, approved, rejected
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Bookings Table
```prisma
model Booking {
  id            Int      @id @default(autoincrement())
  activityId    Int
  activity      Activity @relation(fields: [activityId], references: [id])
  supplierId    Int
  supplier      Supplier @relation(fields: [supplierId], references: [id])
  customerName  String
  customerEmail String
  customerPhone String?
  bookingDate   DateTime
  numberOfGuests Int
  totalAmount   Float
  status        String   @default("pending") // pending, confirmed, completed, cancelled
  specialRequests String? @db.Text
  paymentStatus String   @default("pending") // pending, paid, refunded
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Earnings/Payouts Table
```prisma
model Payout {
  id            Int      @id @default(autoincrement())
  supplierId    Int
  supplier      Supplier @relation(fields: [supplierId], references: [id])
  amount        Float
  currency      String   @default("USD")
  status        String   @default("pending") // pending, processing, completed, failed
  paymentMethod String
  transactionId String?
  payoutDate    DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🔌 API Endpoints Needed

### Activities
- `POST /api/activities` - Create activity
- `GET /api/activities` - List all activities for supplier
- `GET /api/activities/:id` - Get activity details
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `POST /api/activities/:id/submit` - Submit for review
- `POST /api/activities/:id/images` - Upload images

### Bookings
- `GET /api/bookings` - List all bookings for supplier
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/cancel` - Cancel booking

### Earnings
- `GET /api/earnings` - Get earnings summary
- `GET /api/earnings/breakdown` - Get detailed breakdown
- `GET /api/payouts` - List payouts
- `GET /api/payouts/:id` - Get payout details

### Profile
- `GET /api/suppliers/:id` - Get supplier profile
- `PUT /api/suppliers/:id` - Update supplier profile
- `PUT /api/suppliers/:id/password` - Change password
- `PUT /api/suppliers/:id/payment-settings` - Update payment settings

---

## 🎨 UI/UX Considerations

### Design Consistency
- Use green theme (#10B981) throughout
- Match existing design language
- Responsive design (mobile-first)
- Loading states for all async operations
- Error handling with user-friendly messages

### User Experience
- Clear navigation between sections
- Search and filter functionality
- Bulk actions where applicable
- Confirmation dialogs for destructive actions
- Success/error notifications
- Empty states with helpful messages

---

## 📝 Next Steps

1. **Test Login Flow**
   - ✅ Login endpoint working
   - ✅ Dashboard integration complete
   - ⏳ Test with real supplier account

2. **Create Activity Management**
   - Create database schema for activities
   - Build activity creation form
   - Implement activity list view
   - Add edit/delete functionality

3. **Implement Booking System**
   - Create bookings table
   - Build booking list view
   - Add booking details page
   - Implement booking actions

4. **Add Earnings Tracking**
   - Create payouts table
   - Build earnings dashboard
   - Add payment history
   - Implement payment settings

5. **Enhance Profile Management**
   - Add profile edit form
   - Implement password change
   - Add business settings

---

## 🚀 Quick Start Guide for Testing

1. **Register a supplier:**
   - Go to `/supplier`
   - Click "Get Started"
   - Complete registration
   - Verify email

2. **Login:**
   - Click "Sign In" in header
   - Enter email and password
   - Should redirect to dashboard

3. **Dashboard:**
   - View overview stats
   - Navigate between tabs
   - Check account status

---

## 📞 Support & Questions

For any questions about this plan or implementation, refer to:
- Database schema: `server/prisma/schema.prisma`
- API endpoints: `server/server.js`
- Frontend components: `SupplierDashboard.tsx`, `SupplierLogin.tsx`


