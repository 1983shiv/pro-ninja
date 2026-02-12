import { ObjectId } from 'mongodb';

// MongoDB collections schema for Drizzle ORM

// Types for our collections
export interface User {
  _id: string;
  email: string;
  password?: string | null;
  name?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: string;
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

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc?: string | null;
  tierType: string; // FREE, STARTER, GROWTH, AGENCY
  price: number;
  currency: string;
  billingCycle: string;
  features: Record<string, any>;
  reviewLimit: number;
  siteLimit: number;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  version: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  _id: string;
  userId: string;
  productId: string;
  paymentProvider: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  billingEmail: string;
  billingName?: string | null;
  billingAddress?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface License {
  _id: string;
  licenseKey: string;
  userId: string;
  productId: string;
  purchaseId: string;
  status: string;
  activations: number;
  maxActivations: number;
  activatedAt?: Date | null;
  expiresAt?: Date | null;
  lastChecked?: Date | null;
  reviewsUsed: number;
  reviewLimit: number;
  lastResetAt: Date;
  activatedDomains: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Download {
  _id: string;
  userId: string;
  productId: string;
  version: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  downloadedAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any> | null;
  createdAt: Date;
}

// Collection names
export const collections = {
  users: 'users',
  accounts: 'accounts',
  products: 'products',
  purchases: 'purchases',
  licenses: 'licenses',
  downloads: 'downloads',
  notifications: 'notifications',
} as const;

// Helper to create new ObjectId
export const newObjectId = () => new ObjectId().toString();

// Insert types (for new documents)
export type NewUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
export type NewAccount = Omit<Account, '_id'>;
export type NewProduct = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
export type NewPurchase = Omit<Purchase, '_id' | 'createdAt' | 'updatedAt'>;
export type NewLicense = Omit<License, '_id' | 'createdAt' | 'updatedAt'>;
export type NewDownload = Omit<Download, '_id' | 'downloadedAt'>;
export type NewNotification = Omit<Notification, '_id' | 'createdAt'>;
