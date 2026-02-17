import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/drizzle/db'
import { User, newObjectId } from '@/drizzle/schema'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const usersCollection = await getUsersCollection()

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser: User = {
      _id: newObjectId(),
      email,
      password: hashedPassword,
      name: name || null,
      emailVerified: null,
      image: null,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await usersCollection.insertOne(newUser)

    // Don't return password
    const { password: _, ...safeUser } = newUser

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: safeUser 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
