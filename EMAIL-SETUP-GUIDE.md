# Email Configuration Setup Guide

## 📧 Setting Up Email Verification

Your application now requires email verification for new user registrations. Follow these steps to configure email sending:

---

## 1️⃣ Get Resend API Key

1. Visit [Resend.com](https://resend.com)
2. Sign up for a free account
3. Go to **API Keys** section
4. Create a new API key
5. Copy the API key

---

## 2️⃣ Configure Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Resend API Key for sending emails
RESEND_API_KEY=re_your_api_key_here

# Your application URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB Connection (if not already set)
DATABASE_URL=your_mongodb_connection_string
```

---

## 3️⃣ Verify Domain (Production Only)

For production, you need to verify your domain in Resend:

1. Go to Resend Dashboard → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Add DNS records provided by Resend
4. Wait for verification

Update the `from` email in `/lib/mail.ts`:

```typescript
from: "noreply@yourdomain.com",  // Change this
```

---

## 4️⃣ Test Email Configuration

### Using the API:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Check your terminal logs for:
```
Attempting to send verification email to: test@example.com
RESEND_API_KEY set: true
Verification email sent successfully: { id: 'xxx' }
```

### Using the App:

1. Go to `/register` page
2. Fill in the registration form
3. Click Register
4. Check your email inbox (and spam folder)
5. Click the verification link

---

## 5️⃣ Email Flow Overview

### Registration Flow:
```
1. User registers → Account created (emailVerified: null)
2. System sends verification email
3. User clicks link → Email verified
4. User can now login
```

### Login Flow (Unverified Account):
```
1. User tries to login
2. System checks emailVerified status
3. If not verified:
   - Show error: "Please verify your email to login"
   - Automatically send new verification email
   - Show "Resend Verification Email" button
```

---

## 6️⃣ API Endpoints

### Register
```
POST /api/auth/register
Body: { email, password, name }
Response: { success: true, message: "...", emailSent: true }
```

### Verify Email
```
POST /api/auth/verify-email
Body: { token }
Response: { success: "Email verified!" }
```

### Resend Verification
```
POST /api/auth/resend-verification
Body: { email }
Response: { success: true, message: "..." }
```

### Login (Unverified)
```
POST /api/auth/login
Body: { email, password }
Response: { 
  error: "Please verify your email to login",
  emailNotVerified: true,
  message: "...",
  email: "user@example.com"
}
```

---

## 7️⃣ Frontend Integration Example

### Login Component

```typescript
async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.emailNotVerified) {
    // Show error message with resend button
    setError(data.message);
    setShowResendButton(true);
    setUserEmail(data.email);
  } else if (data.success) {
    // Login successful
    router.push('/dashboard');
  }
}

async function resendVerification() {
  const response = await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  });

  const data = await response.json();
  setMessage(data.message);
}
```

---

## 8️⃣ Troubleshooting

### Email Not Sending?

1. **Check API Key**: Verify `RESEND_API_KEY` is set correctly
2. **Check Logs**: Look at terminal output for error messages
3. **Check Spam**: Verification emails might go to spam folder
4. **Rate Limits**: Free Resend accounts have sending limits
5. **Domain Issues**: In production, ensure domain is verified

### Common Errors:

**"Error sending verification email: Invalid API key"**
- Your RESEND_API_KEY is incorrect or not set

**"Error sending verification email: Domain not verified"**
- In production, verify your domain in Resend dashboard

**Email sent successfully but not received:**
- Check spam/junk folder
- Try a different email address
- Check Resend dashboard for delivery status

---

## 9️⃣ Development Testing

For development, use:
- Your personal email
- Temporary email services (for testing)
- Resend's free tier (100 emails/day)

---

## 🔟 Production Checklist

- [ ] Add verified domain in Resend
- [ ] Update `from` email address in `lib/mail.ts`
- [ ] Set `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Test email delivery in production
- [ ] Monitor email sending logs
- [ ] Set up email templates (optional)
- [ ] Configure SPF/DKIM records for better deliverability

---

## 📝 Email Templates Location

All email templates are in: `/lib/mail.ts`

Functions:
- `sendVerificationEmail()` - Registration verification
- `sendPasswordResetEmail()` - Password reset
- `sendTwoFactorTokenEmail()` - 2FA codes

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (if not already)
npm install resend

# 2. Create .env.local file
echo "RESEND_API_KEY=your_key_here" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# 3. Restart your dev server
npm run dev

# 4. Test registration
# Go to http://localhost:3000/register
```

---

## 💡 Tips

1. **Development**: Use your real email address to test
2. **Staging**: Consider using a staging domain
3. **Production**: Always use a verified domain
4. **Monitoring**: Check Resend dashboard for email analytics
5. **Security**: Never commit `.env.local` to git

---

Need help? Check the Resend documentation: https://resend.com/docs
