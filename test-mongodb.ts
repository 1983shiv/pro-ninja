import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const uri = process.env.DATABASE_URL;

async function testConnection() {
  if (!uri) {
    console.error('❌ DATABASE_URL is not set in .env.local');
    console.error('💡 Create a .env.local file with: DATABASE_URL=mongodb+srv://...');
    process.exit(1);
  }

  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📝 Connection string (masked):', uri.replace(/:[^:@]+@/, ':****@'));
    console.log('');

    const client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    console.log('');

    const db = client.db();
    const dbName = db.databaseName;
    console.log(`📦 Database: ${dbName}`);

    const collections = await db.listCollections().toArray();
    console.log(`📚 Collections (${collections.length}):`);
    if (collections.length > 0) {
      collections.forEach(c => console.log(`   - ${c.name}`));
    } else {
      console.log('   (No collections yet - this is normal for new databases)');
    }

    await client.close();
    console.log('');
    console.log('🔌 Connection closed');
    console.log('');
    console.log('✨ Everything looks good! You can now run your application.');
    process.exit(0);
  } catch (error: any) {
    console.error('');
    console.error('❌ MongoDB connection failed!');
    console.error('📛 Error:', error.message);
    console.error('');

    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('💡 SSL/TLS Error - Possible Solutions:');
      console.error('   1. Ensure you use mongodb+srv:// (not mongodb://)');
      console.error('   2. Update mongodb driver: npm install mongodb@latest');
      console.error('   3. Check if your cluster supports TLS 1.2+');
      console.error('   4. Verify your connection string format');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 DNS/Hostname Error - Possible Solutions:');
      console.error('   1. Check your cluster hostname is correct');
      console.error('   2. Verify internet connection');
      console.error('   3. Try accessing MongoDB Atlas in browser');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication Error - Possible Solutions:');
      console.error('   1. Verify username and password are correct');
      console.error('   2. URL encode special characters in password:');
      console.error('      @ → %40, : → %3A, # → %23, etc.');
      console.error('   3. Check Database Access settings in MongoDB Atlas');
    } else if (error.message.includes('not authorized')) {
      console.error('💡 Authorization Error - Possible Solutions:');
      console.error('   1. Grant read/write permissions to database user');
      console.error('   2. Check user is assigned to correct database');
    } else if (error.message.includes('Server selection timed out')) {
      console.error('💡 Connection Timeout - Possible Solutions:');
      console.error('   1. Whitelist your IP in Network Access (MongoDB Atlas)');
      console.error('   2. Allow 0.0.0.0/0 for testing (development only!)');
      console.error('   3. Check firewall/VPN settings');
      console.error('   4. Verify cluster is not paused');
    }

    console.error('');
    console.error('📖 For detailed setup guide, see: MONGODB-SETUP-GUIDE.md');
    process.exit(1);
  }
}

console.log('╔════════════════════════════════════════╗');
console.log('║   MongoDB Connection Test Utility     ║');
console.log('╚════════════════════════════════════════╝');
console.log('');

testConnection();
