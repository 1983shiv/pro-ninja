/**
 * Seed Products Script
 * Creates the 4 pricing tier products in MongoDB (skips any that already exist).
 *
 * Run with:
 *   npm run db:seed-products
 *
 * Or directly:
 *   tsx --env-file=.env.local scripts/seed-products.ts
 */

import { getProductsCollection } from '../drizzle/db';
import { Product, newObjectId } from '../drizzle/schema';

const products: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    slug: 'free',
    name: 'Free Plan',
    description: 'Perfect for trying out AI ReviewSense',
    shortDesc: 'Basic AI review analysis, no credit card needed',
    tierType: 'FREE',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      autoAnalysis: false,
      autoReply: false,
      bulkOperations: false,
      advancedAnalytics: false,
      multiSource: false,
      aiProviders: ['OpenAI GPT-4o-mini'],
    },
    reviewLimit: 25,
    siteLimit: 1,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    version: '1.0.0',
    isActive: true,
    isFeatured: false,
    stripePriceId: null,
  },
  {
    slug: 'starter',
    name: 'Starter Plan',
    description: 'Great for small businesses and growing stores',
    shortDesc: 'Essential features for growing businesses',
    tierType: 'STARTER',
    price: 19,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      autoAnalysis: true,
      autoReply: true,
      bulkOperations: false,
      advancedAnalytics: false,
      multiSource: false,
      aiProviders: ['OpenAI', 'Anthropic', 'Google', 'Groq'],
    },
    reviewLimit: 500,
    siteLimit: 1,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    version: '1.0.0',
    isActive: true,
    isFeatured: false,
    stripePriceId: null,
  },
  {
    slug: 'growth',
    name: 'Growth Plan',
    description: 'For businesses scaling their review operations',
    shortDesc: 'Advanced features with higher limits',
    tierType: 'GROWTH',
    price: 49,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      autoAnalysis: true,
      autoReply: true,
      bulkOperations: true,
      advancedAnalytics: true,
      multiSource: true,
      aiProviders: ['OpenAI', 'Anthropic', 'Google', 'Groq'],
    },
    reviewLimit: 2000,
    siteLimit: 5,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    version: '1.0.0',
    isActive: true,
    isFeatured: true,
    stripePriceId: null,
  },
  {
    slug: 'agency',
    name: 'Agency Plan',
    description: 'Unlimited power for agencies managing multiple clients',
    shortDesc: 'Unlimited reviews and sites for agencies',
    tierType: 'AGENCY',
    price: 149,
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      autoAnalysis: true,
      autoReply: true,
      bulkOperations: true,
      advancedAnalytics: true,
      multiSource: true,
      aiProviders: ['OpenAI', 'Anthropic', 'Google', 'Groq'],
      whiteLabel: true,
      prioritySupport: true,
    },
    reviewLimit: 0, // 0 = unlimited
    siteLimit: 0,   // 0 = unlimited
    fileUrl: null,
    fileName: null,
    fileSize: null,
    version: '1.0.0',
    isActive: true,
    isFeatured: false,
    stripePriceId: null,
  },
];

async function seedProducts() {
  console.log('🌱 Seeding products...\n');

  const collection = await getProductsCollection();

  let created = 0;
  let skipped = 0;

  for (const product of products) {
    const existing = await collection.findOne({ slug: product.slug });

    if (existing) {
      console.log(`⏭️  Skipped  — ${product.name} (slug "${product.slug}" already exists, _id: ${existing._id})`);
      skipped++;
      continue;
    }

    const now = new Date();
    const doc: Product = {
      _id: newObjectId(),
      ...product,
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne(doc);
    console.log(`✅ Created  — ${product.name} (_id: ${doc._id})`);
    created++;
  }

  console.log(`\n📦 Done. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
