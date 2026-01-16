# MVP Flow Plan - Guide Dashboard (Agra, Jaipur, Delhi)

## 🎯 MVP Scope & Goals

### Target Cities (Phase 1)
- **Agra** - Entry tickets and guided tours
- **Jaipur** - Entry tickets and guided tours
- **Delhi** - Entry tickets and guided tours

### Supported Locations/Attractions

#### Agra, India
- Agra Fort
- Taj Mahal
- Baby Taj
- Mehtab Bagh
- Agra Railway Station
- Panch Mahal, Fatehpur Sikri
- Agrasen ki Baoli
- Agra Airport
- Tomb of Akbar the Great
- Sadar Bazar
- Nagina Masjid
- Kinari Bazar
- Mughal Garden
- Humayun Mosque
- Mankameshwar
- Shahjahan Garden

#### New Delhi, India
- India Gate
- Jama Masjid
- Qutb Minar
- Mehrauli New Delhi
- Chandni Chowk
- Humayun's Tomb
- Lotus Temple
- Nizamuddin East New Delhi
- Red Fort
- Indira Gandhi International Airport
- Mahipalpur New Delhi
- Central Secretariat New Delhi
- Connaught Place
- Rashtrapati Bhavan
- Old Delhi
- Farash Khana New Delhi
- Khari Baoli
- Khas Mahal
- Diwan-i-Khas

#### Jaipur, India
- Hawa Mahal
- City Palace
- Jantar Mantar
- Jal Mahal
- Man Sagar Lake
- Albert Hall Museum
- Bapu Bazaar
- Jaipur International Airport
- Nahargarh Fort
- Chandra Mahal
- Patrika Gate
- Maota Lake
- Gaitor Ki Chhatriyan
- Chokhi Dhani

### Core Goal
Allow guides from these 3 cities to:
1. Create and upload tours
2. Get tours approved and live on the site
3. Manage their tours (basic)

---

## 📋 Post-Login Flow (MVP)

### Step 1: First Login After Approval
**What guides see:**
- Welcome message: "Welcome to AsiaByLocals! Let's get your first tour live."
- Account status: "Approved" or "Pending Review"
- Quick stats: 0 tours, 0 bookings

**Key Actions Available:**
- "Create Your First Tour" button (prominent)
- View account status
- Basic profile info

---

### Step 2: Create Tour Flow (MVP)

#### 2.1 Tour Creation Form (Simplified)
**Required Fields Only:**
1. **Tour Title** - e.g., "Taj Mahal Sunrise Tour with Local Guide"
2. **City** - Dropdown: Agra / Jaipur / Delhi (pre-filled based on guide's location)
   
3. **Category** - Dropdown (Only 2 options for MVP):
   - Entry Ticket
   - Guided Tour
   
4. **Locations/Attractions** - Multi-select or search:
   - Guides can select from predefined list of attractions for their city
   - Agra: Taj Mahal, Agra Fort, Baby Taj, etc. (see full list above)
   - Delhi: India Gate, Red Fort, Jama Masjid, etc. (see full list above)
   - Jaipur: Hawa Mahal, City Palace, Jantar Mantar, etc. (see full list above)
3. **Category** - Dropdown (Only 2 options for MVP):
   - Entry Ticket
   - Guided Tour
5. **Locations/Attractions** - Multi-select from predefined list:
   - Based on selected city, show relevant attractions
   - Can select multiple locations for the tour
   - Example: "Taj Mahal, Agra Fort, Baby Taj" for Agra tour
   
6. **Duration** - Hours (e.g., 3 hours, 6 hours, full day)
   - For Entry Tickets: Usually "Flexible" or "Full day"
   - For Guided Tours: Specific hours (2, 3, 4, 6, 8, full day)
   
7. **Price per person** - Currency (₹ INR)
   - Entry Ticket: Fixed price
   - Guided Tour: Price per person
   
8. **Description** - Text area (500-1000 words)
   - Short description (200 chars) - appears in listings
   - Full description (500-1000 words) - detailed tour info
   
9. **What's Included** - Bullet points
   - Entry Ticket: What's included in the ticket
   - Guided Tour: Guide, transportation, entry fees, etc.
   
10. **What's Not Included** (Optional) - Bullet points
    - Optional fees, meals not included, etc.
    
11. **Meeting Point** - Address/location
    - For Guided Tours: Where to meet
    - For Entry Tickets: Where to redeem/collect
    
12. **Tour Images** - Upload 4-7 photos (required)
    - **Requirements:**
      - Minimum 4 photos (recommended 7+)
      - Landscape format (minimum 1280px wide)
      - File types: JPG, JPEG, PNG, GIF (max 7MB each)
      - No watermarks, logos, or AI-generated images
      - Bright, colorful, centered photos
      - Best photo first (shown in search results)
    - Main image (cover photo) - first uploaded
    - Additional images (3-6 more)
    - Drag & drop or file picker
    - Reorder images with arrows
    - Copyright confirmation checkbox required
    
13. **Languages Offered** - Checkboxes
    - English
    - Hindi
    - Other (optional)
    
14. **Guide Type** (For Guided Tours only)
    - Tour Guide (leads group, explains destinations)
    - Host/Greeter (introduction, ticket purchase, no full tour)

**Optional Fields (MVP - Can skip for now):**
- Maximum group size
- Cancellation policy
- Food & drinks included
- Restrictions (who not suitable for)
- Pet policy
- Mandatory items to bring
- Know before you go
- Emergency contact
- Voucher information

**Note:** These optional fields can be added in Phase 2 for more detailed tour information.

#### 2.2 After Creating Tour
**Status Flow:**
1. **Draft** - Guide saves but doesn't submit
2. **Pending Review** - Guide submits for approval
3. **Approved** - Tour goes live on site
4. **Rejected** - Admin rejects with feedback

**What Guide Sees:**
- "Tour submitted for review"
- "We'll review within 24-48 hours"
- Can edit draft tours
- Cannot edit pending/approved tours (need to contact support)

---

### Step 3: Dashboard Overview (MVP)

#### 3.1 Main Sections

**A. Quick Stats Card**
- Total Tours: X
- Live Tours: Y
- Pending Review: Z
- Total Bookings: 0 (for now)

**B. Account Status**
- Approval status badge
- Email verified badge
- "Complete Profile" prompt (if incomplete)

**C. My Tours List**
- Shows all tours (Draft, Pending, Live, Rejected)
- Each tour shows:
  - Thumbnail image
  - Title
  - City
  - Status badge
  - Actions: View, Edit (if draft), Delete (if draft)

**D. Quick Actions**
- "Create New Tour" button
- "View Live Tours" link (opens public site)

---

### Step 4: Tour Management (MVP)

#### 4.1 Tour List View
- Grid or list view of all tours
- Filter by status: All / Draft / Pending / Live / Rejected
- Search by tour title

#### 4.2 Tour Details/Edit
- View full tour details
- Edit (only if Draft status)
- Delete (only if Draft status)
- View on site (if Live)
- See rejection reason (if Rejected)

---

## 🔄 User Journey Flow

### New Guide (First Time)
```
1. Login → Dashboard
2. See "Create Your First Tour" prompt
3. Click → Tour Creation Form
4. Fill required fields
5. Upload images
6. Click "Submit for Review"
7. See "Pending Review" status
8. Wait for approval (24-48 hours)
9. Get email notification when approved
10. Tour goes live on site
```

### Returning Guide
```
1. Login → Dashboard
2. See overview with stats
3. View list of tours
4. Can:
   - Create new tour
   - Edit draft tours
   - View live tours
   - See booking requests (future)
```

---

## 🎨 Dashboard Layout (MVP)

### Navigation Tabs
1. **Overview** (default) - Stats, quick actions, recent tours
2. **My Tours** - List of all tours with filters
3. **Profile** - Account info, edit profile

### Future Tabs (Not in MVP)
- Bookings (Phase 2)
- Earnings (Phase 2)
- Analytics (Phase 2)

---

## 📝 MVP Features Checklist

### ✅ Must Have (MVP)
- [ ] Login/Logout
- [ ] Dashboard overview with stats
- [ ] Create tour form (simplified)
- [ ] Tour list view
- [ ] Tour status management (Draft/Pending/Live/Rejected)
- [ ] Image upload (3-5 photos)
- [ ] City selection (Agra/Jaipur/Delhi only)
- [ ] Basic tour editing (draft only)
- [ ] Tour deletion (draft only)

### ❌ Not in MVP (Phase 2+)
- Booking management
- Earnings tracking
- Calendar/availability
- Customer messaging
- Reviews management
- Analytics/performance
- Multiple languages for tour description
- Advanced pricing (group discounts, etc.)
- Tour variations/options
- **Extra Information Fields:**
  - Food & drinks included
  - Restrictions (who not suitable for)
  - Pet policy
  - Mandatory items to bring
  - Know before you go
  - Emergency contact
  - Voucher information
- Maximum group size
- Cancellation policy details
- Detailed itinerary builder

---

## 🗄️ Database Schema (MVP)

### Tours Table (Simplified)
```prisma
model Tour {
  id              Int      @id @default(autoincrement())
  supplierId      Int
  supplier        Supplier @relation(fields: [supplierId], references: [id])
  
  // Basic Info
  title           String
  city            String   // "Agra" | "Jaipur" | "Delhi"
  category        String   // "Entry Ticket" | "Guided Tour"
  locations       String   // JSON array of selected attractions
  duration        String   // "2 hours" | "3 hours" | "Full day" | "Flexible"
  pricePerPerson  Float
  currency        String   @default("INR")
  
  // Content
  shortDescription String  @db.Text // 200 chars max
  fullDescription  String  @db.Text // 500-1000 words
  included         String  @db.Text // bullet points
  notIncluded      String? @db.Text // optional, bullet points
  meetingPoint     String
  
  // Guide Info (for Guided Tours)
  guideType       String?  // "Tour Guide" | "Host/Greeter"
  
  // Media
  images          String   // JSON array of image URLs (3-5 images)
  
  // Languages
  languages       String   // JSON array ["English", "Hindi"]
  
  // Status
  status          String   @default("draft") // draft, pending, approved, rejected
  rejectionReason String?  @db.Text
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  approvedAt      DateTime?
}
```

---

## 🔌 API Endpoints Needed (MVP)

### Tours
- `POST /api/tours` - Create tour
- `GET /api/tours` - List all tours for supplier
- `GET /api/tours/:id` - Get tour details
- `PUT /api/tours/:id` - Update tour (draft only)
- `DELETE /api/tours/:id` - Delete tour (draft only)
- `POST /api/tours/:id/submit` - Submit for review
- `POST /api/tours/:id/images` - Upload images

### Public (for site)
- `GET /api/public/tours?city=agra` - Get live tours by city
- `GET /api/public/tours/:id` - Get tour details (public)

---

## 🎯 Success Criteria (MVP)

### Guide Can:
1. ✅ Login to dashboard
2. ✅ Create a tour with all required fields
3. ✅ Upload tour images
4. ✅ Submit tour for review
5. ✅ See tour status (Draft/Pending/Live)
6. ✅ Edit draft tours
7. ✅ Delete draft tours
8. ✅ View their tours list

### Admin Can:
1. ✅ Review submitted tours
2. ✅ Approve/reject tours
3. ✅ Provide rejection feedback

### Public Site:
1. ✅ Display live tours by city (Agra/Jaipur/Delhi)
2. ✅ Show tour details page
3. ✅ Filter tours by category

---

## 🚀 Implementation Phases

### Phase 1: MVP (Current Focus)
- Dashboard with overview
- Tour creation (simplified form)
- Tour management (list, edit, delete drafts)
- Status workflow (Draft → Pending → Approved/Rejected)
- City restriction (Agra, Jaipur, Delhi)

### Phase 2: Bookings
- Booking requests
- Accept/decline bookings
- Booking calendar
- Customer communication

### Phase 3: Advanced Features
- Earnings tracking
- Analytics
- Reviews management
- Advanced tour options
- More cities

---

## 💡 Key Design Decisions

### 1. City Restriction
- **Why:** Focus on 3 cities for MVP, ensure quality
- **How:** Dropdown in tour form, pre-filled based on supplier location
- **Future:** Expand to more cities after MVP validation

### 2. Simplified Tour Form
- **Why:** Reduce friction, faster onboarding
- **What's included:** Only essential fields
- **What's excluded:** Advanced features (group size, cancellation policy, etc.)

### 3. Status Workflow
- **Why:** Clear process, prevents confusion
- **Flow:** Draft → Pending → Approved/Rejected
- **Restrictions:** Can only edit drafts, cannot edit live tours

### 4. Image Requirements
- **Why:** Visual appeal, trust building
- **Requirement:** 3-5 images minimum
- **Format:** JPG/PNG, max 5MB each

---

## ❓ Questions to Discuss

1. **Tour Approval Process:**
   - Who approves? (Admin panel needed?)
   - Auto-approve after X successful tours?
   - Rejection feedback format?

2. **City Assignment:**
   - How do we know guide's city? (From registration?)
   - Can guides create tours for multiple cities?
   - Or one city per guide?

3. **Tour Images:**
   - Upload directly or provide URLs?
   - Image hosting solution?
   - Image optimization needed?

4. **Pricing:**
   - Fixed price only? Or variable pricing?
   - Currency: Only INR or multiple?
   - Group discounts in MVP?

5. **Public Site Integration:**
   - How do tours appear on main site?
   - Separate tour listing page?
   - Filter by city/category?

---

## 📊 Next Steps (After Planning)

1. **Finalize MVP scope** - Confirm features
2. **Design database schema** - Create Prisma models
3. **Design API endpoints** - Define request/response formats
4. **Create UI mockups** - Tour creation form, dashboard
5. **Implement backend** - API endpoints
6. **Implement frontend** - Dashboard, tour creation
7. **Testing** - Guide flow, admin approval
8. **Deploy** - Launch MVP

---

## 🎨 UI/UX Considerations

### Dashboard Design
- Clean, modern (like GetYourGuide)
- Green theme (#10B981)
- Clear call-to-actions
- Status badges (color-coded)
- Empty states with helpful messages

### Tour Creation Form
- **Structure:** Step-by-step (like GetYourGuide) or single page?
  - **Recommendation:** Step-by-step for better UX
  - Steps: Category → Basic Info → Locations → Description → Images → Review
- **Progress indicator:** Show completion percentage
- **Save as draft:** Available at any step
- **Image upload:**
  - Drag & drop interface
  - Preview thumbnails
  - Reorder with arrows
  - Show upload progress
  - Validation messages (file size, format, dimensions)
- **Validation:** Real-time validation with helpful error messages
- **Navigation:** Left sidebar with completed steps (green checkmarks)

### Tour List
- **View:** Grid view with thumbnails (recommended)
- **Elements per tour card:**
  - Thumbnail image (first image)
  - Title
  - City badge
  - Category badge (Entry Ticket / Guided Tour)
  - Status badge (Draft/Pending/Live/Rejected)
  - Quick actions (Edit, Delete, View)
- **Filter:** By status, city, category
- **Search:** By tour title

---

**Ready to discuss and refine this plan!** 🚀

