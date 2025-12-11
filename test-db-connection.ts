import 'dotenv/config'
import { prisma } from './lib/prisma'

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Successfully connected to MongoDB!')
    
    // Test creating a user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    })
    console.log('✅ Successfully created test user:', user)
    
    // Fetch all users
    const users = await prisma.user.findMany()
    console.log('✅ All users in database:', users)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
