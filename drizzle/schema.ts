import { ObjectId } from 'mongodb';
import * as z from "zod"


// MongoDB collections schema for Drizzle ORM

// Types for our collections
export interface User {
  _id: string;
  email: string;
  password?: string | null;
  name?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: 'USER' | 'ADMIN' | 'CUSTOMER';
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  _id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface EmailVerificationToken {
  _id: string;
  email: string;
  token: string;
  expires: Date;
  createdAt: Date;
}

export interface PasswordResetToken {
  _id: string;
  email: string;
  token: string;
  expires: Date;
  createdAt: Date;
}

export interface TwoFactorToken {
  _id: string;
  email: string;
  token: string;
  expires: Date;
  createdAt: Date;
}

export interface TwoFactorConfirmation {
  _id: string;
  userId: string;
  createdAt: Date;
}
// ============================================
// PRODUCTS & PRICING
// ============================================

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc?: string | null;
  tierType: 'FREE' | 'STARTER' | 'GROWTH' | 'AGENCY';
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  features: Record<string, any>;
  reviewLimit: number;
  siteLimit: number;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  version: string;
  isActive: boolean;
  isFeatured: boolean;
  stripePriceId?: string | null; // for Stripe integration
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PURCHASES & PAYMENTS
// ============================================

export interface Purchase {
  _id: string;
  userId: string;
  productId: string;
  paymentProvider: 'stripe' | 'paypal' | 'manual';
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  billingEmail: string;
  billingName?: string | null;
  billingAddress?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  purchaseId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId?: string | null;
  paypalOrderId?: string | null;
  failureReason?: string | null;
  refundedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// LICENSES & SUBSCRIPTIONS
// ============================================

export interface License {
  _id: string;
  licenseKey: string;
  userId: string;
  productId: string;
  purchaseId: string;
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  activations: number;
  maxActivations: number;
  activatedDomains: string[];
  activatedAt?: Date | null;
  expiresAt?: Date | null;
  lastValidatedAt?: Date | null;
  reviewsUsed: number;
  reviewLimit: number;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  _id: string;
  userId: string;
  productId: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TRACKING & LOGS
// ============================================

export interface Download {
  _id: string;
  userId: string;
  productId: string;
  licenseId: string;
  version: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  downloadedAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

export interface AuditLog {
  _id: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

// ============================================
// zod based schema and validations
// ============================================

export namespace $Enums {
  export const UserRole = {
    ADMIN: 'ADMIN',
    USER: 'USER'
  } as const;

  export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type UserRole = $Enums.UserRole

export const UserRole = $Enums.UserRole

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })


export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});


// ============================================
// COLLECTION NAMES
// ============================================

export const collections = {
  users: 'users',
  accounts: 'accounts',
  emailVerificationTokens: 'email_verification_tokens',
  passwordResetTokens: 'password_reset_tokens',
  twoFactorTokens: 'two_factor_tokens',
  twoFactorConfirmations: 'two_factor_confirmations',
  products: 'products',
  purchases: 'purchases',
  payments: 'payments',
  licenses: 'licenses',
  subscriptions: 'subscriptions',
  downloads: 'downloads',
  notifications: 'notifications',
  auditLogs: 'audit_logs',
} as const;




// ============================================
// HELPER FUNCTIONS
// ============================================

export const newObjectId = () => new ObjectId().toString();

// Insert types (for new documents)
export type NewUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type NewAccount = Omit<Account, '_id'>;
export type NewProduct = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
export type NewPurchase = Omit<Purchase, '_id' | 'createdAt' | 'updatedAt'>;
export type NewLicense = Omit<License, '_id' | 'createdAt' | 'updatedAt'>;
export type NewDownload = Omit<Download, '_id' | 'downloadedAt'>;
export type NewNotification = Omit<Notification, '_id' | 'createdAt'>;
