# MongoDB Connection Setup Guide

## 🔴 SSL/TLS Error Fix

The error you're seeing indicates a MongoDB SSL/TLS connection issue. Follow these steps:

---

## 1️⃣ Verify Your MongoDB Connection String

### For MongoDB Atlas (Recommended):

Your connection string should look like this:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**⚠️ IMPORTANT**: Notice `mongodb+srv://` (not `mongodb://`)

### Common Mistakes:

❌ **Wrong**: `mongodb://cluster0.xxxxx.mongodb.net`
✅ **Correct**: `mongodb+srv://cluster0.xxxxx.mongodb.net`

---

## 2️⃣ Check Your `.env.local` File

Open your `.env.local` file and verify:

```env
DATABASE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/your-database?retryWrites=true&w=majority
```

**Replace:**
- `username` - Your MongoDB username
- `password` - Your MongoDB password (URL encode special characters!)
- `cluster0.xxxxx` - Your cluster address
- `your-database` - Your database name

---

## 3️⃣ URL Encode Your Password

If your password contains special characters, you MUST URL encode them:

| Character | Encoded |
|-----------|---------|
| @ | %40 |
| : | %3A |
| / | %2F |
| ? | %3F |
| # | %23 |
| [ | %5B |
| ] | %5D |
| % | %25 |

**Example:**
- Password: `MyP@ss:word#123`
- Encoded: `MyP%40ss%3Aword%23123`

**Online Tool**: https://www.urlencoder.org/

---

## 4️⃣ MongoDB Atlas Configuration

### A. Whitelist Your IP Address

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Choose one:
   - **Add Current IP Address** (for your machine)
   - **Allow Access from Anywhere** (0.0.0.0/0) - for development only!

### B. Create Database User

1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set username and password
5. Grant **Read and Write** permissions
6. Click **Add User**

### C. Get Connection String

1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Driver**: Node.js
5. Select **Version**: 5.5 or later
6. Copy the connection string
7. Replace `<password>` with your actual password

---

## 5️⃣ Test Your Connection

Create this test file:

```typescript
// filepath: test-mongodb-connection.ts
import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL!;

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📝 Connection string (masked):', uri.replace(/:[^:@]+@/, ':****@'));

    const client = new MongoClient(uri, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    console.log('✅ MongoDB connection successful!');

    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));

    await client.close();
    console.log('🔌 Connection closed');
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('💡 SSL/TLS Error Fix:');
      console.error('   1. Use mongodb+srv:// (not mongodb://)');
      console.error('   2. Ensure your cluster supports TLS 1.2+');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 DNS Error Fix:');
      console.error('   1. Check your cluster hostname');
      console.error('   2. Verify internet connection');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication Error Fix:');
      console.error('   1. Verify username and password');
      console.error('   2. URL encode special characters in password');
    }
    
    process.exit(1);
  }
}

testConnection();
```

**Run it:**

```bash
npx tsx test-mongodb-connection.ts
```

---

## 6️⃣ Common Issues & Solutions

### Issue 1: SSL/TLS Alert Internal Error

**Error:**
```
MongoServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

**Solutions:**
1. ✅ Use `mongodb+srv://` instead of `mongodb://`
2. ✅ Update MongoDB Node.js driver: `npm install mongodb@latest`
3. ✅ Ensure your connection string has `retryWrites=true&w=majority`
4. ✅ Check if your MongoDB cluster is running

### Issue 2: Authentication Failed

**Error:**
```
MongoServerError: Authentication failed
```

**Solutions:**
1. ✅ Verify username and password in Database Access
2. ✅ URL encode special characters in password
3. ✅ Ensure user has correct database permissions
4. ✅ Check if user is assigned to the correct database

### Issue 3: IP Not Whitelisted

**Error:**
```
MongoNetworkError: connection timed out
```

**Solutions:**
1. ✅ Add your IP to Network Access in MongoDB Atlas
2. ✅ For development, temporarily allow 0.0.0.0/0
3. ✅ Check your firewall settings

### Issue 4: Database Not Found

**Error:**
```
MongoServerError: ns not found
```

**Solutions:**
1. ✅ Specify database name in connection string
2. ✅ Ensure database exists or will be created on first write

---

## 7️⃣ Updated Connection Code

I've updated your `drizzle/db.ts` with:

- ✅ Proper SSL/TLS configuration
- ✅ Connection timeouts
- ✅ Connection pooling
- ✅ Retry logic
- ✅ Better error messages
- ✅ Connection logging

**Restart your dev server:**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 8️⃣ Environment Variables Checklist

Create/update `.env.local`:

```env
# MongoDB Connection (REQUIRED)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# App URL (REQUIRED)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend API Key (for emails)
RESEND_API_KEY=re_your_key_here

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**After updating, restart your server!**

---

## 9️⃣ Verify Everything Works

### Step 1: Check Connection Logs

When you start your server, you should see:

```bash
✅ MongoDB connected successfully
```

If you see errors, read them carefully - they now include helpful hints!

### Step 2: Test Registration

1. Go to `http://localhost:3000/register`
2. Fill in the form
3. Click Register
4. Check terminal - should show successful database operations

### Step 3: Check MongoDB Atlas

1. Go to MongoDB Atlas → Database → Browse Collections
2. You should see your database and `users` collection
3. The new user should appear there

---

## 🔟 MongoDB Atlas Free Tier Limits

Be aware of free tier limitations:

- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Shared CPU
- ✅ No backups
- ✅ Max 100 concurrent connections
- ✅ Perfect for development!

---

## 🆘 Still Having Issues?

### Check These:

1. **MongoDB Driver Version**
   ```bash
   npm list mongodb
   # Should be 5.x or 6.x
   ```

2. **Node.js Version**
   ```bash
   node --version
   # Should be 18.x or higher
   ```

3. **MongoDB Cluster Status**
   - Go to Atlas → Database
   - Ensure cluster shows "Active"
   - Not paused or migrating

4. **Connection String Format**
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
   ^^^^^^^^^^ Must be +srv
   ```

5. **Network Issues**
   - Try connecting from different network
   - Check if VPN is blocking connection
   - Temporarily disable firewall to test

---

## 📞 Need More Help?

If you're still stuck:

1. Share the **error message** (hide credentials!)
2. Share your **connection string format** (mask password!)
3. Check if you can connect using **MongoDB Compass**
4. Verify cluster is in **same region** as you (for faster connection)

---

## ✅ Quick Fix Checklist

- [ ] Connection string uses `mongodb+srv://`
- [ ] Password is URL encoded
- [ ] IP address is whitelisted (or 0.0.0.0/0 for dev)
- [ ] Database user exists with read/write permissions
- [ ] `.env.local` file has correct `DATABASE_URL`
- [ ] Restarted dev server after env changes
- [ ] MongoDB cluster is active (not paused)
- [ ] MongoDB driver is up to date

---

Good luck! 🚀
