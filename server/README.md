# AsiaByLocals Backend Server

Backend API server for AsiaByLocals travel marketplace using Node.js, Express, and PostgreSQL with Prisma ORM.

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** database (or SQLite for local development)
- **npm** (comes with Node.js)

## 🚀 Quick Start Guide

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the `server` directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/asiabylocals?schema=public"
# OR for SQLite (local development):
# DATABASE_URL="file:./dev.db"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:3000

# Razorpay Payment Gateway (for production)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (choose one):
# Option 1: Resend (Recommended)
RESEND_API_KEY=your_resend_api_key

# Option 2: SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Option 3: Gmail SMTP
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed
```

### Step 5: Start the Server

**For Development (with auto-reload):**
```bash
npm run dev
```

**For Production:**
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `.env`)

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run prisma:seed` | Seed database with sample data |
| `npm run fix-pricing` | Fix tour pricing data |

## 🌐 API Endpoints

### Health Check
- **GET** `/api/health` - Check server status

### Public Tours
- **GET** `/api/public/tours` - Get all public tours
- **GET** `/api/public/tours/:id` - Get tour by ID
- **GET** `/api/public/tours?city=CityName` - Get tours by city

### Bookings
- **POST** `/api/bookings` - Create a booking
- **GET** `/api/bookings/:bookingId/confirmation` - Get booking confirmation

### Payments (Razorpay)
- **POST** `/api/payments/create-order` - Create Razorpay order
- **POST** `/api/payments/verify` - Verify payment

### Suppliers
- **POST** `/api/suppliers/register` - Register new supplier
- **POST** `/api/suppliers/login` - Supplier login

### Admin
- **GET** `/api/admin/bookings` - Get all bookings (admin only)
- **PATCH** `/api/suppliers/:id/status` - Update supplier status

## 🐛 Troubleshooting

### Port Already in Use (EADDRINUSE)

**Windows (PowerShell):**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>

# Then restart server
npm run dev
```

**Mac/Linux:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Or kill all Node processes
pkill -f node

# Then restart server
npm run dev
```

### Database Connection Issues

1. **Check DATABASE_URL** in `.env` file
2. **Verify PostgreSQL is running:**
   ```bash
   # Mac/Linux
   pg_isready
   
   # Windows (if PostgreSQL service is running)
   ```
3. **Test connection:**
   ```bash
   npm run prisma:studio
   ```

### Email Not Working

The server will still run without email configuration, but email features won't work. To fix:

1. **For Resend (Recommended):**
   - Sign up at [resend.com](https://resend.com)
   - Get API key
   - Add to `.env`: `RESEND_API_KEY=your_key`

2. **For Gmail:**
   - Enable 2-factor authentication
   - Generate App Password
   - Add to `.env`: `EMAIL_USER` and `EMAIL_APP_PASSWORD`

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

### Migration Issues

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or create new migration
npm run prisma:migrate
```

## 📁 Project Structure

```
server/
├── server.js              # Main server file
├── db.js                  # Prisma database client
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.js            # Database seed file
└── utils/
    ├── email.js           # Email sending utilities
    └── cloudinary.js      # Image upload utilities
```

## 🔐 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `PORT` | No | Server port (default: 3001) | `3001` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `http://localhost:3000` |
| `RAZORPAY_KEY_ID` | Yes* | Razorpay API key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Yes* | Razorpay API secret | `...` |
| `RESEND_API_KEY` | No* | Resend email API key | `re_...` |
| `CLOUDINARY_CLOUD_NAME` | Yes* | Cloudinary cloud name | `...` |
| `CLOUDINARY_API_KEY` | Yes* | Cloudinary API key | `...` |
| `CLOUDINARY_API_SECRET` | Yes* | Cloudinary API secret | `...` |
| `ADMIN_USERNAME` | No | Admin username (default: admin) | `admin` |
| `ADMIN_PASSWORD` | No | Admin password | `secure_password` |

*Required for production, optional for local development

## 🚦 Server Status

When the server starts successfully, you'll see:

```
🚀 Server running on http://localhost:3001
📊 API endpoints available at http://localhost:3001/api
🗄️  Database: PostgreSQL via Prisma ORM
✅ Connected to database via Prisma
```

## 📝 Notes

- The server uses **ES Modules** (`"type": "module"` in package.json)
- CORS is configured to allow requests from `localhost:3000` in development
- The server automatically creates admin user on first run if not exists
- Payment verification includes security checks to prevent fake confirmations
- All bookings are stored with payment status and Razorpay transaction IDs

## 🔗 Related Documentation

- Frontend README: `../README.md`
- Deployment Guide: `../DEPLOYMENT_GUIDE.md`
- Booking & Payment Guide: `../BOOKING_AND_PAYMENT_GUIDE.md`
