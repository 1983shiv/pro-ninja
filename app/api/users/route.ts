import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/drizzle/db';
import { User, newObjectId } from '@/drizzle/schema';
import bcrypt from 'bcrypt';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}).toArray();

    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const usersCollection = await getUsersCollection();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
    };

    await usersCollection.insertOne(newUser);

    // Remove password from response
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}