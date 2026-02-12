import { getUsersCollection, getProductsCollection, getLicensesCollection } from '../drizzle/db';
import { User, Product, License, newObjectId } from '../drizzle/schema';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data (optional - comment out in production)
    const usersCollection = await getUsersCollection();
    const productsCollection = await getProductsCollection();
    const licensesCollection = await getLicensesCollection();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      _id: newObjectId(),
      email: 'admin@ai-reviewsense.com',
      password: adminPassword,
      name: 'Admin User',
      emailVerified: new Date(),
      image: null,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(adminUser);
    console.log('✅ Admin user created: admin@ai-reviewsense.com / admin123');

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const testUser: User = {
      _id: newObjectId(),
      email: 'user@test.com',
      password: userPassword,
      name: 'Test User',
      emailVerified: new Date(),
      image: null,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(testUser);
    console.log('✅ Test user created: user@test.com / user123');

    // Create products
    const products: Product[] = [
      {
        _id: newObjectId(),
        slug: 'free',
        name: 'Free Plan',
        description: 'Perfect for trying out AI ReviewSense',
        shortDesc: 'Get started with basic features',
        tierType: 'FREE',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        features: {
          reviewLimit: 25,
          aiProviders: ['OpenAI GPT-4o-mini'],
          autoAnalysis: false,
          autoReply: false,
          bulkOperations: false,
          advancedAnalytics: false,
          multiSource: false,
          industryTypes: 1,
        },
        reviewLimit: 25,
        siteLimit: 1,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        version: '1.0.0',
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: newObjectId(),
        slug: 'starter',
        name: 'Starter Plan',
        description: 'Great for small businesses',
        shortDesc: 'Essential features for growing businesses',
        tierType: 'STARTER',
        price: 19,
        currency: 'USD',
        billingCycle: 'monthly',
        features: {
          reviewLimit: 500,
          aiProviders: ['OpenAI', 'Anthropic', 'Google', 'Groq'],
          autoAnalysis: true,
          autoReply: true,
          bulkOperations: false,
          advancedAnalytics: false,
          multiSource: false,
          industryTypes: 9,
        },
        reviewLimit: 500,
        siteLimit: 1,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        version: '1.0.0',
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: newObjectId(),
        slug: 'growth',
        name: 'Growth Plan',
        description: 'Advanced features for scaling businesses',
        shortDesc: 'Everything you need to grow',
        tierType: 'GROWTH',
        price: 49,
        currency: 'USD',
        billingCycle: 'monthly',
        features: {
          reviewLimit: 2500,
          aiProviders: ['OpenAI', 'Anthropic', 'Google', 'Groq'],
          autoAnalysis: true,
          autoReply: true,
          bulkOperations: true,
          advancedAnalytics: true,
          multiSource: true,
          industryTypes: 9,
        },
        reviewLimit: 2500,
        siteLimit: 3,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        version: '1.0.0',
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: newObjectId(),
        slug: 'agency',
        name: 'Agency Plan',
        description: 'Unlimited features for agencies',
        shortDesc: 'Complete solution for agencies',
        tierType: 'AGENCY',
        price: 149,
        currency: 'USD',
        billingCycle: 'monthly',
        features: {
          reviewLimit: -1,
          aiProviders: ['OpenAI', 'Anthropic', 'Google', 'Groq'],
          autoAnalysis: true,
          autoReply: true,
          bulkOperations: true,
          advancedAnalytics: true,
          multiSource: true,
          industryTypes: 9,
          whiteLabel: true,
          prioritySupport: 'Phone/Slack',
        },
        reviewLimit: -1, // Unlimited
        siteLimit: -1, // Unlimited
        fileUrl: null,
        fileName: null,
        fileSize: null,
        version: '1.0.0',
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await productsCollection.insertMany(products);
    console.log('✅ Created 4 products (Free, Starter, Growth, Agency)');

    // Create sample license for test user
    const starterProduct = products.find(p => p.slug === 'starter');
    if (starterProduct) {
      const license: License = {
        _id: newObjectId(),
        licenseKey: uuidv4(),
        userId: testUser._id,
        productId: starterProduct._id,
        purchaseId: newObjectId(), // Mock purchase ID
        status: 'active',
        activations: 0,
        maxActivations: 1,
        activatedAt: null,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        lastChecked: null,
        reviewsUsed: 0,
        reviewLimit: 500,
        lastResetAt: new Date(),
        activatedDomains: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await licensesCollection.insertOne(license);
      console.log(`✅ Created sample license: ${license.licenseKey}`);
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
