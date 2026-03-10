import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsersCollection } from '@/drizzle/db';
import { User, newObjectId } from '@/drizzle/schema';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use!' },
        { status: 409 }
      );
    }

    const usersCollection = await getUsersCollection();

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
      isTwoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    // Generate and send verification token
    try {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful! Please check your email to verify your account',
          emailSent: true,
        },
        { status: 201 }
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      
      // User is created but email failed - inform them
      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful but failed to send verification email. Please use resend verification.',
          emailSent: false,
          email: email,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
