import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/drizzle/db';
import { User, PasswordResetToken, collections } from '@/drizzle/schema';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';

export async function POST(request: NextRequest) {
  try {
    const { password, token } = await request.json();

    // Validation
    if (!token) {
      return NextResponse.json(
        { error: 'Missing token!' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return NextResponse.json(
        { error: 'Invalid token!' },
        { status: 400 }
      );
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json(
        { error: 'Token has expired!' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Email does not exist!' },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await getDb();
    const usersCollection = db.collection<User>(collections.users);

    await usersCollection.updateOne(
      { _id: existingUser.id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    const passwordResetTokensCollection = db.collection<PasswordResetToken>(
      collections.passwordResetTokens
    );
    await passwordResetTokensCollection.deleteOne({ _id: existingToken._id });

    return NextResponse.json(
      { success: 'Password updated!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('New password error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
