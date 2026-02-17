# Authentication Testing Guide

This guide provides step-by-step instructions for testing all authentication features in the AI ReviewSense SaaS platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Test Scenarios](#test-scenarios)
4. [OAuth Provider Setup](#oauth-provider-setup)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before testing, ensure you have:
- ✅ Node.js 18+ installed
- ✅ MongoDB Atlas connection string in `.env.local`
- ✅ Google OAuth credentials configured
- ✅ GitHub OAuth credentials configured
- ✅ NextAuth secret generated
- ✅ Development server running

## Environment Setup

### 1. Verify Environment Variables

Check your `.env.local` file contains:

```env
# Database
DATABASE_URL=mongodb+srv://your-connection-string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Start the Development Server

```powershell
# Navigate to saas-website directory
cd "d:\jobs\idea n research\saas-website"

# Set DATABASE_URL in terminal session (Windows PowerShell)
$env:DATABASE_URL = "your-mongodb-connection-string"

# Start the server
npm run dev
```

### 3. Verify Server is Running

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the homepage with navigation bar showing "Sign In" and "Get Started" buttons.

---

## Test Scenarios

### Scenario 1: Email/Password Registration

**Objective**: Create a new user account using email and password.

**Steps**:

1. **Navigate to Registration Page**
   - Click "Get Started" button in navigation
   - Or go to: `http://localhost:3000/auth/register`

2. **Fill in Registration Form**
   ```
   Name: Test User
   Email: testuser@example.com
   Password: test123456
   Confirm Password: test123456
   ```

3. **Submit the Form**
   - Click "Create Account" button
   - ⏱️ Wait for processing (password hashing takes ~1-2 seconds)

4. **Expected Results**
   - ✅ Redirected to sign-in page (`/auth/signin`)
   - ✅ Success message displayed
   - ✅ New user created in MongoDB `users` collection

5. **Verify in Database**
   ```javascript
   // Run in MongoDB Atlas or Compass
   db.users.findOne({ email: "testuser@example.com" })
   ```
   
   Expected document:
   ```json
   {
     "_id": ObjectId("..."),
     "name": "Test User",
     "email": "testuser@example.com",
     "password": "$2b$10$...", // Hashed password
     "emailVerified": null,
     "image": null,
     "role": "user",
     "createdAt": ISODate("..."),
     "updatedAt": ISODate("...")
   }
   ```

**Validation Checks**:
- ❌ Try registering with same email again → Should show "Email already exists" error
- ❌ Try password < 6 characters → Should show validation error
- ❌ Try mismatched passwords → Should show "Passwords don't match" error
- ❌ Try invalid email format → Should show validation error

---

### Scenario 2: Email/Password Sign In

**Objective**: Sign in with email and password credentials.

**Steps**:

1. **Navigate to Sign In Page**
   - Click "Sign In" button in navigation
   - Or go to: `http://localhost:3000/auth/signin`

2. **Fill in Sign In Form**
   ```
   Email: testuser@example.com
   Password: test123456
   ```

3. **Submit the Form**
   - Click "Sign In with Email" button

4. **Expected Results**
   - ✅ Redirected to dashboard (`/dashboard`)
   - ✅ User profile card displayed
   - ✅ Navigation shows user name/email
   - ✅ "Sign Out" button appears in navigation

5. **Verify Session**
   - Check browser developer tools → Application → Cookies
   - Look for cookies starting with `next-auth.` or `authjs.`
   - JWT token should be present

**Test Cases**:
- ✅ Sign in with correct credentials → Success
- ❌ Sign in with wrong password → "Invalid credentials" error
- ❌ Sign in with non-existent email → "Invalid credentials" error
- ❌ Sign in with empty fields → Validation error

**Using Seeded Test Users**:

The database seeding script created two test users:

```
Admin User:
Email: admin@ai-reviewsense.com
Password: admin123

Regular User:
Email: user@test.com
Password: user123
```

Try signing in with these credentials.

---

### Scenario 3: Google OAuth Sign In

**Objective**: Sign in using Google account.

**Prerequisites**:
- Google OAuth credentials must be configured in `.env.local`
- Authorized redirect URI must be set in Google Console:
  ```
  http://localhost:3000/api/auth/callback/google
  ```

**Steps**:

1. **Navigate to Sign In Page**
   - Go to: `http://localhost:3000/auth/signin`

2. **Click "Continue with Google" Button**
   - Should redirect to Google's authorization page

3. **Google Authorization Flow**
   - Select or sign in with your Google account
   - Review permissions requested
   - Click "Allow" or "Continue"

4. **Expected Results**
   - ✅ Redirected back to your app (`/dashboard`)
   - ✅ User profile card shows Google account info
   - ✅ Navigation shows Google profile name
   - ✅ User signed in successfully

5. **Verify in Database**

   Check `users` collection:
   ```javascript
   db.users.findOne({ email: "your-google-email@gmail.com" })
   ```
   
   Expected document:
   ```json
   {
     "_id": ObjectId("..."),
     "name": "Your Google Name",
     "email": "your-google-email@gmail.com",
     "emailVerified": ISODate("..."),
     "image": "https://lh3.googleusercontent.com/...",
     "role": "user",
     "createdAt": ISODate("..."),
     "updatedAt": ISODate("...")
   }
   ```

   Check `accounts` collection:
   ```javascript
   db.accounts.findOne({ provider: "google" })
   ```
   
   Expected document:
   ```json
   {
     "_id": ObjectId("..."),
     "userId": ObjectId("..."), // References user._id
     "type": "oauth",
     "provider": "google",
     "providerAccountId": "1234567890",
     "access_token": "ya29...",
     "expires_at": 1234567890,
     "scope": "openid email profile",
     "token_type": "Bearer",
     "id_token": "eyJh..."
   }
   ```

**Test Cases**:
- ✅ First-time Google sign in → Creates new user + account
- ✅ Subsequent Google sign in → Links to existing user
- ✅ Same email different provider → Links to same user
- ✅ Profile image from Google → Displayed in UI

---

### Scenario 4: GitHub OAuth Sign In

**Objective**: Sign in using GitHub account.

**Prerequisites**:
- GitHub OAuth credentials must be configured in `.env.local`
- Authorization callback URL must be set in GitHub App:
  ```
  http://localhost:3000/api/auth/callback/github
  ```

**Steps**:

1. **Navigate to Sign In Page**
   - Go to: `http://localhost:3000/auth/signin`

2. **Click "Continue with GitHub" Button**
   - Should redirect to GitHub's authorization page

3. **GitHub Authorization Flow**
   - Sign in with GitHub if not already
   - Review permissions requested
   - Click "Authorize [Your App Name]"

4. **Expected Results**
   - ✅ Redirected back to your app (`/dashboard`)
   - ✅ User profile card shows GitHub account info
   - ✅ Navigation shows GitHub username
   - ✅ User signed in successfully

5. **Verify in Database**

   Check `users` collection:
   ```javascript
   db.users.findOne({ email: "your-github-email@gmail.com" })
   ```
   
   Check `accounts` collection:
   ```javascript
   db.accounts.findOne({ provider: "github" })
   ```
   
   Expected account document:
   ```json
   {
     "_id": ObjectId("..."),
     "userId": ObjectId("..."),
     "type": "oauth",
     "provider": "github",
     "providerAccountId": "12345678",
     "access_token": "gho_...",
     "token_type": "bearer",
     "scope": "read:user,user:email"
   }
   ```

**Test Cases**:
- ✅ First-time GitHub sign in → Creates new user + account
- ✅ Subsequent GitHub sign in → Links to existing user
- ✅ Public email on GitHub → Uses public email
- ✅ Private email on GitHub → Uses primary verified email

---

### Scenario 5: Account Linking (Same Email, Different Providers)

**Objective**: Verify that signing in with different OAuth providers using the same email links to the same user account.

**Steps**:

1. **Sign In with Google**
   - Use email: `yourname@gmail.com`
   - Complete Google OAuth flow
   - Note the user profile on dashboard

2. **Sign Out**
   - Click "Sign Out" button in navigation

3. **Sign In with GitHub**
   - Use same email: `yourname@gmail.com`
   - Complete GitHub OAuth flow

4. **Expected Results**
   - ✅ Same user account is used (check user ID)
   - ✅ Both providers linked to same user
   - ✅ Can sign in with either Google or GitHub

5. **Verify in Database**
   ```javascript
   // Find user
   const user = db.users.findOne({ email: "yourname@gmail.com" })
   
   // Find all accounts for this user
   db.accounts.find({ userId: user._id })
   ```
   
   Expected: Two account documents (one for Google, one for GitHub), same userId.

---

### Scenario 6: Protected Route Access

**Objective**: Verify that protected routes (like dashboard) require authentication.

**Test Cases**:

1. **Access Dashboard While Signed Out**
   - Sign out if currently signed in
   - Navigate to: `http://localhost:3000/dashboard`
   - ✅ Expected: Redirected to sign-in page (`/auth/signin`)

2. **Access Dashboard While Signed In**
   - Sign in with any method
   - Navigate to: `http://localhost:3000/dashboard`
   - ✅ Expected: Dashboard displayed with user info

3. **Session Persistence**
   - Sign in
   - Refresh the page
   - ✅ Expected: Still signed in (session persists)

4. **Multiple Tabs**
   - Sign in in one tab
   - Open dashboard in another tab
   - ✅ Expected: Both tabs show authenticated state

---

### Scenario 7: Sign Out

**Objective**: Test sign-out functionality.

**Steps**:

1. **Sign In**
   - Sign in with any method

2. **Click "Sign Out" Button**
   - Click "Sign Out" in navigation

3. **Expected Results**
   - ✅ Redirected to homepage (`/`)
   - ✅ Navigation shows "Sign In" and "Get Started" buttons
   - ✅ Session cleared from cookies
   - ✅ Cannot access `/dashboard` without signing in again

4. **Verify Session Cleared**
   - Check browser cookies → Next-auth cookies should be removed
   - Try accessing `/dashboard` → Should redirect to sign-in

---

### Scenario 8: User Roles (Admin vs User)

**Objective**: Test role-based access.

**Steps**:

1. **Sign In as Admin**
   ```
   Email: admin@ai-reviewsense.com
   Password: admin123
   ```
   
   - Check dashboard → Role should show "admin"

2. **Sign In as Regular User**
   ```
   Email: user@test.com
   Password: user123
   ```
   
   - Check dashboard → Role should show "user"

3. **Verify Role in Session**
   - Open browser DevTools → Console
   - Run:
     ```javascript
     // In a client component, you can access:
     const { data: session } = useSession();
     console.log(session?.user?.role);
     ```

**Future Enhancement**:
You can add role-based UI elements:
```tsx
{session?.user?.role === "admin" && (
  <Link href="/admin">Admin Panel</Link>
)}
```

---

## OAuth Provider Setup

### Google OAuth Setup

**Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable Google+ API

**Step 2: Create OAuth Credentials**

1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure:
   ```
   Name: AI ReviewSense
   Authorized JavaScript origins:
     - http://localhost:3000
   
   Authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google
   ```
5. Copy Client ID and Client Secret to `.env.local`

**Step 3: Configure OAuth Consent Screen**

1. Go to "OAuth consent screen"
2. Select "External" (for testing)
3. Fill in app information:
   ```
   App name: AI ReviewSense
   User support email: your-email@example.com
   Developer contact: your-email@example.com
   ```
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your Google account email)

### GitHub OAuth Setup

**Step 1: Create GitHub OAuth App**

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Configure:
   ```
   Application name: AI ReviewSense
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```
4. Click "Register application"

**Step 2: Generate Client Secret**

1. Click "Generate a new client secret"
2. Copy Client ID and Client Secret to `.env.local`

**Important Notes**:
- GitHub OAuth apps don't require additional verification for testing
- You can use any GitHub account to test
- Email must be verified on GitHub

---

## Troubleshooting

### Issue 1: "Configuration error" on Sign In

**Symptoms**:
- Error message: "There is a problem with the server configuration"
- Sign-in doesn't work

**Solutions**:

1. **Check Environment Variables**
   ```powershell
   # Verify .env.local exists
   Get-Content .env.local
   ```
   
   Ensure all required variables are set:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

2. **Restart Development Server**
   ```powershell
   # Stop server (Ctrl+C)
   # Restart
   npm run dev
   ```

3. **Check DATABASE_URL**
   ```powershell
   # Set in terminal session
   $env:DATABASE_URL = "your-connection-string"
   npm run dev
   ```

### Issue 2: OAuth Redirect Mismatch

**Symptoms**:
- "redirect_uri_mismatch" error from Google/GitHub
- OAuth flow fails

**Solutions**:

1. **Google**:
   - Go to Google Cloud Console
   - Check "Authorized redirect URIs"
   - Must exactly match: `http://localhost:3000/api/auth/callback/google`
   - No trailing slash

2. **GitHub**:
   - Go to GitHub OAuth App settings
   - Check "Authorization callback URL"
   - Must exactly match: `http://localhost:3000/api/auth/callback/github`

### Issue 3: Database Connection Errors

**Symptoms**:
- "MongoError" in console
- Sign-in/registration fails

**Solutions**:

1. **Verify MongoDB Connection**
   ```powershell
   # Test connection
   node test-db-connection.js
   ```

2. **Check IP Whitelist**
   - Go to MongoDB Atlas
   - Network Access → Add your IP or use `0.0.0.0/0` for testing

3. **Verify Connection String**
   - Must include username, password, database name
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Issue 4: "Invalid credentials" on Sign In

**Symptoms**:
- Registered successfully but can't sign in
- "Invalid credentials" error

**Solutions**:

1. **Check Password**
   - Ensure password is exactly as entered during registration
   - Passwords are case-sensitive

2. **Verify User in Database**
   ```javascript
   db.users.findOne({ email: "your-email@example.com" })
   ```
   
   - User should exist
   - Password should be hashed (starts with `$2b$10$`)

3. **Try Registering New Account**
   - Use different email
   - Ensure password meets requirements (min 6 chars)

### Issue 5: Session Not Persisting

**Symptoms**:
- Signed in but session lost on refresh
- "Sign In" button appears after refresh

**Solutions**:

1. **Check Browser Cookies**
   - Cookies must be enabled
   - Third-party cookies may interfere

2. **Check NEXTAUTH_URL**
   - Must match exactly: `http://localhost:3000`
   - No trailing slash
   - Must use `http://` (not `https://` for localhost)

3. **Clear Cookies and Try Again**
   - DevTools → Application → Cookies
   - Clear all cookies for localhost:3000
   - Sign in again

### Issue 6: "Account not linked" Error

**Symptoms**:
- Signed in with email/password
- Try OAuth with same email
- Error message

**Solutions**:

This shouldn't happen with the current configuration (account linking is automatic). If it does:

1. **Check auth.ts Configuration**
   - Verify `allowDangerousEmailAccountLinking: true` is set
   - This enables automatic account linking

2. **Manual Link in Database**
   ```javascript
   // Find user
   const user = db.users.findOne({ email: "email@example.com" })
   
   // Find orphaned account
   const account = db.accounts.findOne({ provider: "google" })
   
   // Link account to user
   db.accounts.updateOne(
     { _id: account._id },
     { $set: { userId: user._id } }
   )
   ```

---

## Testing Checklist

Use this checklist to systematically test all features:

### Basic Authentication
- [ ] Register new user with email/password
- [ ] Sign in with email/password
- [ ] Sign out
- [ ] Access protected route (dashboard) while signed out → redirect
- [ ] Access protected route while signed in → success

### OAuth Providers
- [ ] Sign in with Google (first time)
- [ ] Sign out and sign in with Google again
- [ ] Sign in with GitHub (first time)
- [ ] Sign out and sign in with GitHub again

### Account Linking
- [ ] Register with email/password
- [ ] Sign out, sign in with Google (same email) → links
- [ ] Sign out, sign in with GitHub (same email) → links
- [ ] Verify all providers link to same user

### Session Management
- [ ] Sign in and refresh page → session persists
- [ ] Sign in and open new tab → authenticated in both
- [ ] Sign out in one tab → signed out in all tabs

### User Roles
- [ ] Sign in as admin → role shows "admin"
- [ ] Sign in as regular user → role shows "user"

### Error Handling
- [ ] Register with existing email → error
- [ ] Sign in with wrong password → error
- [ ] Sign in with non-existent email → error
- [ ] Password validation (< 6 chars) → error
- [ ] Password mismatch on registration → error

### Database Verification
- [ ] New user created in `users` collection
- [ ] Password is hashed (bcrypt)
- [ ] OAuth account created in `accounts` collection
- [ ] Account linked to user via `userId`

---

## Next Steps

After completing all tests:

1. **Production Deployment**
   - Update OAuth redirect URIs to production domain
   - Set `NEXTAUTH_URL` to production URL
   - Use strong `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - Enable MongoDB IP whitelist for production

2. **Email Verification**
   - Add email verification flow
   - Send verification email on registration
   - Mark `emailVerified` field in database

3. **Password Reset**
   - Implement "Forgot Password" feature
   - Generate reset tokens
   - Send reset email

4. **Two-Factor Authentication**
   - Add TOTP-based 2FA
   - QR code generation
   - Backup codes

5. **User Profile Management**
   - Allow users to update name, email
   - Upload profile picture
   - Change password

---

## Support

If you encounter issues not covered in this guide:

1. Check browser console for errors
2. Check terminal/server logs
3. Verify MongoDB Atlas connection
4. Review NextAuth.js documentation: https://next-auth.js.org/
5. Check OAuth provider documentation

---

**Last Updated**: January 2025  
**NextAuth Version**: 5.0.0-beta  
**Next.js Version**: 16.0.0
