import { MongoClient, Db, Collection } from 'mongodb';
import {
  User,
  Account,
  Product,
  Purchase,
  License,
  Download,
  Notification,
  collections,
} from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const uri = process.env.DATABASE_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the value across module reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database instance
export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

// Collection getters
export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDb();
  return db.collection<User>(collections.users);
}

export async function getAccountsCollection(): Promise<Collection<Account>> {
  const db = await getDb();
  return db.collection<Account>(collections.accounts);
}

export async function getProductsCollection(): Promise<Collection<Product>> {
  const db = await getDb();
  return db.collection<Product>(collections.products);
}

export async function getPurchasesCollection(): Promise<Collection<Purchase>> {
  const db = await getDb();
  return db.collection<Purchase>(collections.purchases);
}

export async function getLicensesCollection(): Promise<Collection<License>> {
  const db = await getDb();
  return db.collection<License>(collections.licenses);
}

export async function getDownloadsCollection(): Promise<Collection<Download>> {
  const db = await getDb();
  return db.collection<Download>(collections.downloads);
}

export async function getNotificationsCollection(): Promise<Collection<Notification>> {
  const db = await getDb();
  return db.collection<Notification>(collections.notifications);
}

// Helper to create indexes (run once during setup)
export async function createIndexes() {
  const db = await getDb();

  // Users indexes
  await db.collection(collections.users).createIndex({ email: 1 }, { unique: true });

  // Accounts indexes
  await db.collection(collections.accounts).createIndex({ userId: 1 });
  await db.collection(collections.accounts).createIndex(
    { provider: 1, providerAccountId: 1 },
    { unique: true }
  );

  // Products indexes
  await db.collection(collections.products).createIndex({ slug: 1 }, { unique: true });
  await db.collection(collections.products).createIndex({ isActive: 1 });

  // Purchases indexes
  await db.collection(collections.purchases).createIndex({ userId: 1 });
  await db.collection(collections.purchases).createIndex({ transactionId: 1 }, { unique: true });

  // Licenses indexes
  await db.collection(collections.licenses).createIndex({ licenseKey: 1 }, { unique: true });
  await db.collection(collections.licenses).createIndex({ userId: 1 });
  await db.collection(collections.licenses).createIndex({ status: 1 });
  await db.collection(collections.licenses).createIndex({ purchaseId: 1 }, { unique: true });

  // Downloads indexes
  await db.collection(collections.downloads).createIndex({ userId: 1 });
  await db.collection(collections.downloads).createIndex({ downloadedAt: -1 });

  // Notifications indexes
  await db.collection(collections.notifications).createIndex({ userId: 1 });
  await db.collection(collections.notifications).createIndex({ isRead: 1 });

  console.log('✅ All indexes created successfully');
}

export default clientPromise;
