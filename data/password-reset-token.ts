import { PasswordResetToken, collections } from '@/drizzle/schema';
import { getDb } from '@/drizzle/db';

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const db = await getDb();
    const passwordResetTokensCollection = db.collection<PasswordResetToken>(collections.passwordResetTokens);
    const passwordResetToken = await passwordResetTokensCollection.findOne({ token });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const db = await getDb();
    const passwordResetTokensCollection = db.collection<PasswordResetToken>(collections.passwordResetTokens);
    const passwordResetToken = await passwordResetTokensCollection.findOne({ email });

    return passwordResetToken;
  } catch {
    return null;
  }
};