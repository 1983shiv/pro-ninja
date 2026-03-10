"use server";

import { getDb } from '@/drizzle/db';
import { User, EmailVerificationToken, collections } from '@/drizzle/schema';
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
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
      }
    }
  );

  const verificationTokensCollection = db.collection<EmailVerificationToken>(collections.emailVerificationTokens);
  await verificationTokensCollection.deleteOne({ _id: existingToken._id });

  return { success: "Email verified!" };
};
