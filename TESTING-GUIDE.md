# AI ReviewSense SaaS - Testing Guide

This document provides step-by-step instructions to test all implemented functionalities using Drizzle ORM.

## Prerequisites

1. **MongoDB Atlas Connection**
   - Ensure `DATABASE_URL` is set in `.env.local`
   - Set environment variable: `$env:DATABASE_URL = "mongodb+srv://..."`

2. **Dependencies Installed**
   ```bash
   npm install
   ```

3. **Database Initialized**
   ```bash
   $env:DATABASE_URL = "your-mongodb-connection-string"
   npm run db:setup
   ```

---

## Test Accounts

After running `npm run db:setup`, the following test accounts are available:

### Admin Account
- **Email:** `admin@ai-reviewsense.com`
- **Password:** `admin123`
- **Role:** admin

### Test User Account
- **Email:** `user@test.com`
- **Password:** `user123`
- **Role:** user
- **Has:** 1 active Starter plan license

---

## Starting the Development Server

```bash
# Set the DATABASE_URL environment variable for the session
$env:DATABASE_URL = "mongodb+srv://ninjatechapp_db_user:lEoIb37zAK1ou0BG@saas-wp-plugin.epfei5t.mongodb.net/ai-reviewsense?appName=saas-wp-plugin"

# Start the Next.js development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Testing Each Functionality

### 1. Homepage Test
**Objective:** Verify the landing page loads correctly

**Steps:**
1. Open browser to `http://localhost:3000`
2. Verify you see:
   - "AI ReviewSense" heading
   - "Transform customer reviews..." description
   - "View Pricing" button
   - "Go to Dashboard" button
   - Three feature cards (AI-Powered, Automated, Analytics)

**Expected Result:** ✅ All elements display correctly

---

### 2. Pricing Page Test
**Objective:** Verify products are fetched from database and displayed

**Steps:**
1. Click "View Pricing" or navigate to `http://localhost:3000/pricing`
2. Verify you see 4 pricing cards:
   - **Free Plan** - $0
   - **Starter Plan** - $19/monthly (marked as Popular)
   - **Growth Plan** - $49/monthly (marked as Popular)
   - **Agency Plan** - $149/monthly

**Expected Result:** ✅ All 4 plans display with correct pricing and features

**Technical Check:**
- Open browser DevTools → Network tab
- Look for API call to `/api/products?active=true`
- Response should contain 4 products from MongoDB

---

### 3. API: Get All Products
**Objective:** Test products API endpoint

**Method:** GET `/api/products?active=true`

**Using Browser:**
1. Navigate to `http://localhost:3000/api/products?active=true`
2. You should see JSON response with products array

**Using curl/PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products?active=true" -Method GET
```

**Expected Response:**
```json
{
  "products": [
    {
      "_id": "...",
      "slug": "free",
      "name": "Free Plan",
      "tierType": "FREE",
      "price": 0,
      "reviewLimit": 25,
      ...
    },
    ...
  ]
}
```

**Expected Result:** ✅ Returns 4 products

---

### 4. API: Get Product by Slug
**Objective:** Test single product retrieval

**Method:** GET `/api/products/starter`

**Test:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products/starter" -Method GET
```

**Expected Response:**
```json
{
  "product": {
    "_id": "...",
    "slug": "starter",
    "name": "Starter Plan",
    "price": 19,
    "reviewLimit": 500,
    ...
  }
}
```

**Expected Result:** ✅ Returns Starter plan details

---

### 5. API: Create New User
**Objective:** Test user registration

**Method:** POST `/api/users`

**Test:**
```powershell
$body = @{
    email = "newuser@example.com"
    password = "password123"
    name = "New User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "user": {
    "_id": "...",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user",
    "createdAt": "...",
    ...
  }
}
```

**Expected Result:** ✅ User created successfully (password not in response)

**Verify in Database:**
- User is created with hashed password
- Role is set to "user" by default

---

### 6. API: License Validation
**Objective:** Test license key validation (used by WordPress plugin)

**Method:** POST `/api/licenses/validate`

**Get Test License Key:**
After seeding, check the console output for the license key (UUID format).
Example: `453eef07-043e-40eb-971a-a907e91dd77a`

**Test with Valid License:**
```powershell
$body = @{
    licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"
    domain = "example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/validate" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "valid": true,
  "license": {
    "key": "453eef07-043e-40eb-971a-a907e91dd77a",
    "status": "active",
    "plan": "STARTER",
    "reviewLimit": 500,
    "reviewsUsed": 0,
    "siteLimit": 1,
    "activations": 0,
    "maxActivations": 1,
    "expiresAt": "2026-02-12T..."
  }
}
```

**Expected Result:** ✅ License is valid

**Test with Invalid License:**
```powershell
$body = @{
    licenseKey = "invalid-key-12345"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/validate" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "valid": false,
  "error": "Invalid license key"
}
```

**Expected Result:** ✅ Returns 404 error with "Invalid license key"

---

### 7. API: Activate License on Domain
**Objective:** Test license activation

**Method:** POST `/api/licenses/activate`

**Test:**
```powershell
$body = @{
    licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"
    domain = "mywebsite.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/activate" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "License activated successfully",
  "activations": 1,
  "maxActivations": 1
}
```

**Expected Result:** ✅ License activated on domain

**Verify:**
1. Run validation again - should still be valid
2. Check `activatedDomains` includes "mywebsite.com"
3. `activations` count increased to 1

**Test Activation Limit:**
Try activating on a second domain:
```powershell
$body = @{
    licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"
    domain = "secondwebsite.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/activate" -Method POST -Body $body -ContentType "application/json"
```

**Expected Result:** ✅ Returns error "Maximum activations reached"

---

### 8. API: Deactivate License from Domain
**Objective:** Test license deactivation

**Method:** POST `/api/licenses/deactivate`

**Test:**
```powershell
$body = @{
    licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"
    domain = "mywebsite.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/deactivate" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "License deactivated successfully",
  "activations": 0,
  "maxActivations": 1
}
```

**Expected Result:** ✅ License deactivated, activation count decremented

---

### 9. API: Track License Usage
**Objective:** Test usage tracking for review limits

**Method:** POST `/api/licenses/usage`

**Test:**
```powershell
$body = @{
    licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"
    reviewsCount = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/usage" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "reviewsUsed": 10,
  "reviewLimit": 500,
  "remaining": 490
}
```

**Expected Result:** ✅ Usage tracked, remaining reviews calculated

**Test Multiple Times:**
Run the same request again with `reviewsCount: 5`

**Expected Response:**
```json
{
  "success": true,
  "reviewsUsed": 15,
  "reviewLimit": 500,
  "remaining": 485
}
```

**Expected Result:** ✅ Usage increments correctly (10 + 5 = 15)

---

### 10. Dashboard Page Test
**Objective:** Verify dashboard displays correctly

**Steps:**
1. Navigate to `http://localhost:3000/dashboard`
2. Verify you see:
   - "Dashboard" heading
   - 3 stats cards (Active Licenses, Total Reviews, Review Limit)
   - "Test License Validation" section
   - "Your Licenses" section showing "You don't have any licenses yet"

**Test License Validation Form:**
1. Enter the test license key: `453eef07-043e-40eb-971a-a907e91dd77a`
2. Click "Validate License"
3. Verify JSON response appears below showing license details

**Expected Result:** ✅ Dashboard loads and license validation works

---

### 11. Database Direct Queries (Optional)
**Objective:** Verify data is correctly stored in MongoDB

If you have MongoDB Compass or access to MongoDB shell:

**Check Users:**
```javascript
db.users.find().pretty()
```
Expected: 2 users (admin and test user)

**Check Products:**
```javascript
db.products.find().pretty()
```
Expected: 4 products (Free, Starter, Growth, Agency)

**Check Licenses:**
```javascript
db.licenses.find().pretty()
```
Expected: 1 license for test user

**Check Indexes:**
```javascript
db.users.getIndexes()
db.licenses.getIndexes()
db.products.getIndexes()
```
Expected: Indexes created on key fields (email, licenseKey, slug, etc.)

---

## Common Issues & Troubleshooting

### Issue: Database Connection Error
**Error:** `MongoParseError: Invalid scheme`

**Solution:**
```powershell
# Ensure DATABASE_URL is set correctly
$env:DATABASE_URL = "mongodb+srv://..."
npm run dev
```

### Issue: "User already exists" when creating user
**Solution:** Use a different email address or clear the database:
```powershell
# Re-seed database (will clear existing data)
npm run db:setup
```

### Issue: License validation returns 404
**Solution:** 
- Verify the license key from seed output
- Check MongoDB to see if license exists
- Ensure database is seeded properly

### Issue: Environment variables not loading
**Solution:**
Create `.env.local` file with:
```
DATABASE_URL="your-mongodb-connection-string"
```

---

## API Testing with Postman/Insomnia

### Collection Setup
Create a new collection with base URL: `http://localhost:3000`

### Endpoints to Test:

1. **GET** `/api/products` - List all products
2. **GET** `/api/products/starter` - Get product by slug
3. **POST** `/api/users` - Create user
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "name": "Test User"
   }
   ```
4. **POST** `/api/licenses/validate` - Validate license
   ```json
   {
     "licenseKey": "453eef07-043e-40eb-971a-a907e91dd77a",
     "domain": "example.com"
   }
   ```
5. **POST** `/api/licenses/activate` - Activate license
   ```json
   {
     "licenseKey": "453eef07-043e-40eb-971a-a907e91dd77a",
     "domain": "mysite.com"
   }
   ```
6. **POST** `/api/licenses/deactivate` - Deactivate license
   ```json
   {
     "licenseKey": "453eef07-043e-40eb-971a-a907e91dd77a",
     "domain": "mysite.com"
   }
   ```
7. **POST** `/api/licenses/usage` - Track usage
   ```json
   {
     "licenseKey": "453eef07-043e-40eb-971a-a907e91dd77a",
     "reviewsCount": 10
   }
   ```

---

## WordPress Plugin Integration Testing

### Simulate WordPress Plugin Calls

The WordPress plugin will make the following API calls:

**1. License Activation (on plugin activation)**
```php
POST /api/licenses/activate
{
  "licenseKey": "user-entered-key",
  "domain": "wordpress-site.com"
}
```

**2. License Validation (daily check)**
```php
POST /api/licenses/validate
{
  "licenseKey": "stored-key"
}
```

**3. Usage Tracking (after analyzing reviews)**
```php
POST /api/licenses/usage
{
  "licenseKey": "stored-key",
  "reviewsCount": 5
}
```

You can simulate these using PowerShell as shown in the tests above.

---

## Performance Testing

### Test Database Query Performance

```powershell
# Test product listing speed
Measure-Command {
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
}
```

**Expected:** < 500ms for first request (includes DB connection), < 100ms for subsequent requests

### Test License Validation Speed
```powershell
Measure-Command {
    $body = @{licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"} | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/validate" -Method POST -Body $body -ContentType "application/json"
}
```

**Expected:** < 200ms (critical for WordPress plugin user experience)

---

## Next Steps

After completing all tests:

1. ✅ All API endpoints working
2. ✅ Database CRUD operations successful
3. ✅ License system functional
4. ✅ Usage tracking accurate

**Ready for:**
- Authentication implementation (NextAuth.js)
- Payment integration (Stripe/PayPal)
- User dashboard enhancements
- Admin panel development
- WordPress plugin integration

---

## Quick Reference: Database Commands

```bash
# Initialize database (create indexes)
npm run db:init

# Seed database with test data
npm run db:seed

# Complete setup (init + seed)
npm run db:setup

# Start development server
npm run dev
```

**Remember:** Always set `$env:DATABASE_URL` before running database commands!

---

## Test Checklist

- [ ] Homepage loads successfully
- [ ] Pricing page displays 4 plans
- [ ] GET /api/products returns all products
- [ ] GET /api/products/:slug returns single product
- [ ] POST /api/users creates new user
- [ ] POST /api/licenses/validate works with valid key
- [ ] POST /api/licenses/validate rejects invalid key
- [ ] POST /api/licenses/activate activates license
- [ ] POST /api/licenses/activate enforces activation limit
- [ ] POST /api/licenses/deactivate deactivates license
- [ ] POST /api/licenses/usage tracks review count
- [ ] Dashboard page loads
- [ ] License validation form works on dashboard

**All tests passing? 🎉 Implementation is complete!**
