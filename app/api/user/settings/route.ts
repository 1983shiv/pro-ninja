import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { getDb } from '@/drizzle/db';
import { User, collections } from '@/drizzle/schema';
import { getUserByEmail, getUserById } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const values = await request.json();
    const { name, email, password, newPassword, isTwoFactorEnabled, role } = values;

    const dbUser = await getUserById(session.user.id);

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is OAuth user (disable certain updates)
    const isOAuth = !dbUser.password;

    if (isOAuth) {
      // OAuth users cannot change email, password, or 2FA
      if (email || password || newPassword || isTwoFactorEnabled !== undefined) {
        return NextResponse.json(
          { error: 'OAuth users cannot modify email, password, or 2FA settings' },
          { status: 403 }
        );
      }
    }

    // Handle email change
    if (email && email !== dbUser.email) {
      const existingUser = await getUserByEmail(email);

      if (existingUser && existingUser.id !== dbUser.id) {
        return NextResponse.json(
          { error: 'Email already in use!' },
          { status: 409 }
        );
      }

      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return NextResponse.json({
        success: true,
        message: 'Verification email sent!',
      });
    }

    // Handle password change
    let hashedPassword: string | undefined;
    if (password && newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(password, dbUser.password);

      if (!passwordsMatch) {
        return NextResponse.json(
          { error: 'Incorrect password!' },
          { status: 401 }
        );
      }

      if (newPassword.length < 5) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters' },
          { status: 400 }
        );
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Prepare update data
    const db = await getDb();
    const usersCollection = db.collection<User>(collections.users);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name;
    }

    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    if (isTwoFactorEnabled !== undefined && !isOAuth) {
      updateData.isTwoFactorEnabled = isTwoFactorEnabled;
    }

    if (role !== undefined) {
      // Only admins can change roles
      if (session.user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only admins can change user roles' },
          { status: 403 }
        );
      }
      updateData.role = role;
    }

    await usersCollection.updateOne(
      { _id: dbUser.id },
      { $set: updateData }
    );

    // Fetch updated user
    const updatedUser = await usersCollection.findOne({ _id: dbUser.id });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user!' },
        { status: 500 }
      );
    }

    // Don't return password
    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'Settings updated!',
      user: safeUser,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
