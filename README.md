# Asia By Locals - Premium Travel Marketplace

A travel marketplace platform connecting travelers with local tour guides across Asia.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (for production)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if exists)
   - Set `DATABASE_URL` for your database
   - Configure email settings (Gmail App Password or Resend)

3. **Set up database:**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run development server:**
   ```bash
   # Frontend (from root)
   npm run dev
   
   # Backend (from server directory)
   cd server
   npm run dev
   ```

## 📦 Deployment

See deployment guides:
- `RENDER_UNIFIED_DEPLOYMENT.md` - Deploy to Render
- `DEPLOYMENT_GUIDE.md` - General deployment guide

## 🏗️ Project Structure

- `/src` - Frontend React components
- `/server` - Backend Express API
- `/public` - Static assets
- `/server/prisma` - Database schema and migrations

## 🔧 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Prisma ORM)
- **Email:** Nodemailer / Resend
- **Storage:** Cloudinary (for images)

## 📚 Documentation

See the various `.md` files in the root directory for detailed guides on:
- Deployment
- Database setup
- Email configuration
- SEO optimization
- And more...
