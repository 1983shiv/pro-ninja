# 🚀 Quick Start Guide

## Setup (First Time Only)

```powershell
# 1. Navigate to project
cd "d:\jobs\idea n research\saas-website"

# 2. Install dependencies
npm install

# 3. Set environment variable
$env:DATABASE_URL = "mongodb+srv://ninjatechapp_db_user:lEoIb37zAK1ou0BG@saas-wp-plugin.epfei5t.mongodb.net/ai-reviewsense?appName=saas-wp-plugin"

# 4. Initialize database
npm run db:setup

# 5. Start server
npm run dev
```

Visit: **http://localhost:3000**

---

## Daily Development

```powershell
# Set environment variable (required every time)
$env:DATABASE_URL = "mongodb+srv://ninjatechapp_db_user:lEoIb37zAK1ou0BG@saas-wp-plugin.epfei5t.mongodb.net/ai-reviewsense?appName=saas-wp-plugin"

# Start server
npm run dev
```

---

## Test License Key

After seeding, use this UUID format license key:
`453eef07-043e-40eb-971a-a907e91dd77a`

---

## Quick Tests

### Test License Validation (PowerShell)
```powershell
$body = @{licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/validate" -Method POST -Body $body -ContentType "application/json"
```

### Test License Activation
```powershell
$body = @{licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"; domain = "mysite.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/activate" -Method POST -Body $body -ContentType "application/json"
```

### Test Usage Tracking
```powershell
$body = @{licenseKey = "453eef07-043e-40eb-971a-a907e91dd77a"; reviewsCount = 10} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/licenses/usage" -Method POST -Body $body -ContentType "application/json"
```

---

## URLs

- **Homepage:** http://localhost:3000
- **Pricing:** http://localhost:3000/pricing
- **Dashboard:** http://localhost:3000/dashboard
- **API Products:** http://localhost:3000/api/products
- **API License Validate:** http://localhost:3000/api/licenses/validate

---

## Test Accounts

| Type | Email | Password |
|------|-------|----------|
| Admin | admin@ai-reviewsense.com | admin123 |
| User | user@test.com | user123 |

---

## Database Commands

```bash
npm run db:init      # Create indexes only
npm run db:seed      # Add test data only
npm run db:setup     # Initialize + seed
```

---

## Troubleshooting

**Server won't start?**
```powershell
$env:DATABASE_URL = "mongodb+srv://..."
```

**Need fresh data?**
```powershell
npm run db:setup
```

**Port 3000 in use?**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

## Documentation

📘 **TESTING-GUIDE.md** - Complete testing instructions  
📗 **README-DRIZZLE.md** - Setup and configuration  
📙 **IMPLEMENTATION-COMPLETE.md** - What's implemented  

---

**Happy Testing! 🎉**
