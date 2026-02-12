# AI ReviewSense SaaS Website - Drizzle ORM Implementation

A Next.js 16 SaaS application for managing WordPress plugin licenses with Drizzle ORM and MongoDB.

## 🚀 Features Implemented

- ✅ **Drizzle ORM** with MongoDB Atlas integration
- ✅ **Database Schema** for users, products, licenses, and more
- ✅ **RESTful API Routes** for license management
- ✅ **User Dashboard** with license validation testing
- ✅ **Pricing Page** displaying product tiers
- ✅ **Seed Data** with test accounts and sample products
- ✅ **Complete Testing Guide** for all functionality

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- PowerShell (for Windows users)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd saas-website
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
DATABASE_URL="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ai-reviewsense?appName=your-app"
```

### 3. Set Environment Variable (Windows PowerShell)

**Important:** MongoDB connection requires setting the environment variable in your terminal session:

```powershell
$env:DATABASE_URL = "mongodb+srv://your-connection-string"
```

### 4. Initialize Database

```bash
# Create indexes
npm run db:init

# Seed test data
npm run db:seed

# Or do both at once
npm run db:setup
```

This will create:
- **Admin user:** `admin@ai-reviewsense.com` / `admin123`
- **Test user:** `user@test.com` / `user123`
- **4 Products:** Free, Starter, Growth, Agency plans
- **1 Sample license** for the test user

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
saas-website/
├── app/
│   ├── api/
│   │   ├── licenses/
│   │   │   ├── validate/route.ts      # License validation
│   │   │   ├── activate/route.ts      # License activation
│   │   │   ├── deactivate/route.ts    # License deactivation
│   │   │   └── usage/route.ts         # Usage tracking
│   │   ├── products/
│   │   │   ├── route.ts               # List/create products
│   │   │   └── [slug]/route.ts        # Get/update/delete product
│   │   └── users/route.ts             # User management
│   ├── dashboard/page.tsx             # User dashboard
│   ├── pricing/page.tsx               # Pricing page
│   └── page.tsx                       # Homepage
├── drizzle/
│   ├── schema.ts                      # Database schema (TypeScript types)
│   └── db.ts                          # MongoDB connection & collections
├── scripts/
│   ├── init-db.ts                     # Initialize database indexes
│   └── seed-db.ts                     # Seed test data
├── components/ui/                     # Shadcn UI components
├── drizzle.config.ts                  # Drizzle configuration
├── .env.local                         # Environment variables
└── TESTING-GUIDE.md                   # Comprehensive testing guide
```

## 🗄️ Database Schema

### Collections

1. **users** - User accounts with authentication
2. **accounts** - OAuth provider accounts
3. **products** - Plugin pricing tiers and features
4. **purchases** - Payment transactions
5. **licenses** - License keys and activation
6. **downloads** - Download tracking
7. **notifications** - User notifications

### Key Features

- Automatic index creation
- Bcrypt password hashing
- UUID license key generation
- MongoDB ObjectId support
- TypeScript type safety

## 🔌 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:slug` - Update product (admin)
- `DELETE /api/products/:slug` - Delete product (admin)

### Licenses
- `POST /api/licenses/validate` - Validate license key
- `POST /api/licenses/activate` - Activate license on domain
- `POST /api/licenses/deactivate` - Deactivate license from domain
- `POST /api/licenses/usage` - Track review usage

### Users
- `GET /api/users` - List all users (admin)
- `POST /api/users` - Create new user

## 🧪 Testing

See [TESTING-GUIDE.md](./TESTING-GUIDE.md) for comprehensive testing instructions.

### Quick Test

```powershell
# 1. Set environment variable
$env:DATABASE_URL = "your-mongodb-connection-string"

# 2. Start server
npm run dev

# 3. Test license validation
$body = @{licenseKey = "your-license-key"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/validate" -Method POST -Body $body -ContentType "application/json"
```

## 📊 Sample Data

After running `npm run db:seed`, you'll have:

### Products
- **Free Plan:** $0 - 25 reviews/month
- **Starter Plan:** $19/mo - 500 reviews/month
- **Growth Plan:** $49/mo - 2,500 reviews/month
- **Agency Plan:** $149/mo - Unlimited reviews

### Test Users
- **Admin:** admin@ai-reviewsense.com (password: admin123)
- **User:** user@test.com (password: user123)

### Test License
A valid Starter plan license is created for the test user. Check the seed output for the UUID.

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server

# Database
npm run db:init          # Create database indexes
npm run db:seed          # Seed test data
npm run db:setup         # Initialize + seed

# Build
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## 🚨 Important Notes

### Environment Variable Setup

**The DATABASE_URL environment variable MUST be set in your terminal session before running any database commands or starting the development server.**

For PowerShell (Windows):
```powershell
$env:DATABASE_URL = "mongodb+srv://..."
```

For Bash (Mac/Linux):
```bash
export DATABASE_URL="mongodb+srv://..."
```

### Why?

Next.js and the build tools load environment variables at different stages. Setting it in the terminal ensures it's available for all processes.

## 🛡️ Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- License keys use UUID v4 for uniqueness
- MongoDB connections use secure TLS
- Sensitive data excluded from API responses

## 🎯 Next Steps

1. **Authentication** - Implement NextAuth.js for user login
2. **Payments** - Integrate Stripe and PayPal
3. **Email** - Set up Resend or SendGrid for notifications
4. **Admin Panel** - Build admin dashboard
5. **WordPress Integration** - Connect plugin to license API

## 📝 Changelog

### v1.0.0 - Initial Drizzle ORM Implementation
- Replaced Prisma with Drizzle ORM
- Implemented MongoDB schema with TypeScript
- Created license validation system
- Added API routes for products and licenses
- Built user dashboard and pricing pages
- Created comprehensive testing guide

## 🤝 Contributing

This is a proprietary project for AI ReviewSense WordPress plugin.

## 📄 License

Proprietary - All rights reserved

---

## 🔗 Related Documentation

- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Complete testing instructions
- [dev-plan.md](../ref/dev-plan.md) - Full development plan
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

---

**Built with ❤️ using Next.js 16, Drizzle ORM, and MongoDB**
