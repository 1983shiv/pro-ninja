import 'dotenv/config'
import { prisma } from './lib/prisma.js'

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Successfully connected to MongoDB!')
    
    // Test creating a user or fetch if exists
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (user) {
      console.log('✅ Test user already exists:', user)
    } else {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User'
        }
      })
      console.log('✅ Successfully created test user:', user)
    }
    
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
