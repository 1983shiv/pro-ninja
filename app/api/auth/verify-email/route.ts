import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/drizzle/db';
import { User, EmailVerificationToken, collections } from '@/drizzle/schema';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verificiation-token';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return NextResponse.json(
        { error: 'Token does not exist!' },
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

    const db = await getDb();
    const usersCollection = db.collection<User>(collections.users);

    await usersCollection.updateOne(
      { _id: existingUser.id },
      {
        $set: {
          emailVerified: new Date(),
          email: existingToken.email,
          updatedAt: new Date(),
        },
      }
    );

    const verificationTokensCollection = db.collection<EmailVerificationToken>(
      collections.emailVerificationTokens
    );
    await verificationTokensCollection.deleteOne({ _id: existingToken._id });

    return NextResponse.json(
      { success: 'Email verified!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
