import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { getDb } from '@/drizzle/db';
import { 
  TwoFactorToken, 
  PasswordResetToken, 
  EmailVerificationToken, 
  collections, 
  newObjectId 
} from '@/drizzle/schema';
import { getVerificationTokenByEmail } from "@/data/verificiation-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  const db = await getDb();
  const twoFactorTokensCollection = db.collection<TwoFactorToken>(collections.twoFactorTokens);

  if (existingToken) {
    await twoFactorTokensCollection.deleteOne({ _id: existingToken._id });
  }

  const twoFactorToken: TwoFactorToken = {
    _id: newObjectId(),
    email,
    token,
    expires,
    createdAt: new Date(),
  };

  await twoFactorTokensCollection.insertOne(twoFactorToken);

  return twoFactorToken;
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  const db = await getDb();
  const passwordResetTokensCollection = db.collection<PasswordResetToken>(collections.passwordResetTokens);

  if (existingToken) {
    await passwordResetTokensCollection.deleteOne({ _id: existingToken._id });
  }

  const passwordResetToken: PasswordResetToken = {
    _id: newObjectId(),
    email,
    token,
    expires,
    createdAt: new Date(),
  };

  await passwordResetTokensCollection.insertOne(passwordResetToken);

  return passwordResetToken;
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  const db = await getDb();
  const verificationTokensCollection = db.collection<EmailVerificationToken>(collections.emailVerificationTokens);

  if (existingToken) {
    await verificationTokensCollection.deleteOne({ _id: existingToken._id });
  }

  const verificationToken: EmailVerificationToken = {
    _id: newObjectId(),
    email,
    token,
    expires,
    createdAt: new Date(),
  };

  await verificationTokensCollection.insertOne(verificationToken);

  return verificationToken;
};
