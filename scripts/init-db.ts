import { createIndexes } from '../drizzle/db';

async function initialize() {
  try {
    console.log('🚀 Initializing database...');
    await createIndexes();
    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initialize();
