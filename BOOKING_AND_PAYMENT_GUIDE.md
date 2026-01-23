# Booking & Money Management Guide

## 📋 Current Booking Flow

### 1. **Customer Booking Process**

**Step 1: Select Tour & Option**
- Customer visits tour detail page
- Selects a tour option (if available)
- Chooses date and number of participants
- Clicks "Check availability"

**Step 2: Fill Booking Form**
- Customer enters:
  - Name
  - Email
  - Phone (optional)
  - Special requests (optional)
- Clicks "Proceed to Booking"

**Step 3: Payment**
- Booking is created in database (status: `pending`, paymentStatus: `pending`)
- Razorpay payment gateway opens
- Customer pays via Razorpay
- Payment is verified on backend
- Booking status changes to `confirmed`, paymentStatus: `paid`

---

## 💰 Money Management System

### Current Status: **BASIC IMPLEMENTATION**

#### ✅ What's Implemented:

1. **Booking Creation**
   - Stores booking with customer details
   - Calculates total amount (option price × guests)
   - Links to tour and tour option
   - Tracks supplier ID

2. **Payment Processing**
   - Razorpay integration (frontend)
   - Payment order creation (backend)
   - Payment verification (backend)
   - Stores Razorpay transaction IDs

3. **Database Schema**
   - `Booking` model with all necessary fields
   - Payment status tracking
   - Booking status tracking

#### ❌ What's Missing:

1. **Supplier Earnings Dashboard**
   - No earnings display in SupplierDashboard
   - No payment history
   - No earnings breakdown

2. **Admin Commission System**
   - No commission calculation
   - No platform fee deduction
   - No admin earnings tracking

3. **Payout System**
   - No supplier payout functionality
   - No payment to supplier accounts
   - No payout history

4. **Refund Management**
   - No refund processing
   - No cancellation refunds
   - No refund history

---

## 🏗️ Recommended Money Management Architecture

### Option 1: **Platform Commission Model** (Recommended)

```
Customer Payment: ₹1,000
├── Platform Commission (15%): ₹150
└── Supplier Payout (85%): ₹850
```

**How it works:**
1. Customer pays full amount to platform
2. Platform holds money in escrow
3. After tour completion, platform:
   - Deducts commission (15%)
   - Transfers remaining to supplier
4. Supplier receives payout via bank transfer/UPI

### Option 2: **Fixed Fee Model**

```
Customer Payment: ₹1,000
├── Platform Fee (₹50): ₹50
└── Supplier Payout: ₹950
```

**How it works:**
1. Customer pays full amount
2. Platform deducts fixed fee
3. Rest goes to supplier

---

## 📊 Database Schema for Money Management

### Current Booking Fields:
```prisma
model Booking {
  totalAmount      Float     // Total paid by customer
  currency         String    // INR, USD, etc.
  paymentStatus    String    // pending, paid, refunded
  razorpayOrderId  String?   // Razorpay order ID
  razorpayPaymentId String?  // Razorpay payment ID
  status           String    // pending, confirmed, completed, cancelled
}
```

### Needed Additional Fields:
```prisma
model Booking {
  // ... existing fields ...
  
  platformCommission Float?   // Platform's commission amount
  supplierPayout     Float?   // Amount to be paid to supplier
  payoutStatus       String?  // pending, paid, failed
  payoutDate         DateTime? // When supplier was paid
  payoutTransactionId String? // Payout transaction reference
}

model SupplierPayout {
  id              Int       @id @default(autoincrement())
  supplierId      Int
  bookingId      Int
  amount          Float
  status          String    // pending, processing, completed, failed
  payoutMethod    String    // bank_transfer, upi, etc.
  transactionId   String?
  createdAt       DateTime
  completedAt     DateTime?
}
```

---

## 🔧 Implementation Steps

### Phase 1: Supplier Earnings Dashboard (Priority 1)

**Files to Update:**
- `SupplierDashboard.tsx` - Add earnings tab
- `server/server.js` - Add earnings API endpoints

**Features:**
- Total earnings (all time)
- Earnings this month
- Earnings breakdown by tour
- Payment history
- Pending payouts

**API Endpoints Needed:**
```
GET /api/suppliers/:id/earnings
GET /api/suppliers/:id/bookings
GET /api/suppliers/:id/payouts
```

### Phase 2: Commission Calculation (Priority 2)

**When booking is confirmed:**
1. Calculate platform commission (15% or fixed fee)
2. Calculate supplier payout (remaining amount)
3. Store in booking record
4. Update supplier earnings

**Commission Logic:**
```javascript
const platformCommission = totalAmount * 0.15; // 15%
const supplierPayout = totalAmount - platformCommission;
```

### Phase 3: Payout System (Priority 3)

**Features:**
- Supplier requests payout
- Admin approves payout
- Transfer money to supplier account
- Update payout status
- Send confirmation email

**Payout Methods:**
- Bank transfer (NEFT/RTGS)
- UPI
- Razorpay Payouts API

### Phase 4: Refund Management (Priority 4)

**Features:**
- Process refunds for cancellations
- Refund to customer via Razorpay
- Update booking status
- Track refund history

---

## 💳 Razorpay Setup

### Current Status:
- ✅ Frontend integration (Razorpay checkout)
- ✅ Backend order creation
- ✅ Payment verification
- ⚠️ Using mock/test keys

### Production Setup Needed:

1. **Get Razorpay Account:**
   - Sign up at https://razorpay.com
   - Complete KYC verification
   - Get API keys (Key ID & Key Secret)

2. **Add to Environment Variables:**
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```

3. **Enable Razorpay Payouts (for supplier payouts):**
   - Enable RazorpayX in dashboard
   - Add supplier bank accounts
   - Use Razorpay Payouts API

---

## 📈 Money Flow Diagram

```
Customer Books Tour (₹1,000)
    ↓
Payment via Razorpay
    ↓
Money Received by Platform
    ↓
Booking Confirmed
    ↓
[After Tour Completion]
    ↓
Calculate Commission (₹150)
    ↓
Supplier Payout (₹850)
    ↓
Transfer to Supplier Account
```

---

## 🎯 Next Steps

### Immediate (High Priority):
1. ✅ **Add Earnings Tab to Supplier Dashboard**
   - Show total earnings
   - Show earnings by month
   - List all bookings

2. ✅ **Add Bookings Display**
   - Show all bookings for supplier
   - Filter by status
   - Show booking details

### Short Term (Medium Priority):
3. **Implement Commission Calculation**
   - Calculate on booking confirmation
   - Store commission and payout amounts
   - Update supplier earnings

4. **Add Payout Request System**
   - Supplier can request payout
   - Admin approves
   - Process payout

### Long Term (Low Priority):
5. **Razorpay Payouts Integration**
   - Automated payouts
   - Bank transfer integration
   - Payout tracking

6. **Refund System**
   - Cancellation refunds
   - Partial refunds
   - Refund history

---

## 📝 API Endpoints Needed

### Supplier Earnings:
```
GET /api/suppliers/:id/earnings
  Returns: {
    totalEarnings: number,
    thisMonth: number,
    pendingPayouts: number,
    bookings: Booking[]
  }
```

### Supplier Bookings:
```
GET /api/suppliers/:id/bookings
  Query params: status, startDate, endDate
  Returns: Booking[]
```

### Supplier Payouts:
```
GET /api/suppliers/:id/payouts
POST /api/suppliers/:id/payouts/request
  Body: { amount, payoutMethod }
```

### Admin Payouts:
```
GET /api/admin/payouts/pending
POST /api/admin/payouts/:id/approve
POST /api/admin/payouts/:id/reject
```

---

## 🔐 Security Considerations

1. **Payment Verification:**
   - Always verify Razorpay signature
   - Never trust frontend payment data
   - Verify on backend before confirming

2. **Payout Security:**
   - Require admin approval for payouts
   - Verify supplier identity
   - Log all payout transactions

3. **Commission Protection:**
   - Calculate commission server-side
   - Store commission in database
   - Audit trail for all transactions

---

## 💡 Recommendations

1. **Start Simple:**
   - Implement earnings dashboard first
   - Show bookings and earnings
   - Manual payout process initially

2. **Automate Later:**
   - Add automated payouts after testing
   - Use Razorpay Payouts API
   - Implement auto-payouts after tour completion

3. **Commission Rate:**
   - Start with 15% platform commission
   - Adjust based on business needs
   - Can vary by tour category

4. **Payout Schedule:**
   - Weekly payouts (every Monday)
   - Or after tour completion
   - Minimum payout threshold (e.g., ₹1,000)

---

## 📞 Support

For Razorpay integration help:
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com
- Payouts API: https://razorpay.com/docs/payouts/




