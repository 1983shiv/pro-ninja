import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/drizzle/db';
import { collections, TwoFactorToken, TwoFactorConfirmation, newObjectId } from '@/drizzle/schema';
import { getUserByEmail } from '@/data/user';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const { email, password, code } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json(
        { error: 'Invalid credentials!' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials!' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(existingUser.email);

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return NextResponse.json(
        { 
          error: 'Please verify your email to login',
          emailNotVerified: true,
          message: 'A verification email has been sent to your email address. Please check your inbox.',
          email: existingUser.email
        },
        { status: 403 }
      );
    }

    // Handle 2FA if enabled
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        // Verify 2FA code
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

        if (!twoFactorToken) {
          return NextResponse.json(
            { error: 'Invalid code!' },
            { status: 400 }
          );
        }

        if (twoFactorToken.token !== code) {
          return NextResponse.json(
            { error: 'Invalid code!' },
            { status: 400 }
          );
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return NextResponse.json(
            { error: 'Code expired!' },
            { status: 400 }
          );
        }

        const db = await getDb();
        const twoFactorTokensCollection = db.collection<TwoFactorToken>(collections.twoFactorTokens);
        await twoFactorTokensCollection.deleteOne({ _id: twoFactorToken._id });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        const twoFactorConfirmationsCollection = db.collection<TwoFactorConfirmation>(collections.twoFactorConfirmations);

        if (existingConfirmation) {
          await twoFactorConfirmationsCollection.deleteOne({ _id: existingConfirmation._id });
        }

        await twoFactorConfirmationsCollection.insertOne({
          _id: newObjectId(),
          userId: existingUser.id,
          createdAt: new Date(),
        });
      } else {
        // Send 2FA code
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        );

        return NextResponse.json(
          { twoFactor: true, message: '2FA code sent to your email' },
          { status: 200 }
        );
      }
    }

    // Don't return password
    const { password: _, ...safeUser } = existingUser;

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        user: safeUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong!' },
      { status: 500 }
    );
  }
}
