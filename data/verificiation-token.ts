"use server"
import { EmailVerificationToken, collections } from '@/drizzle/schema';
import { getDb } from '@/drizzle/db';

export const getVerificationTokenByToken = async (
  token: string
) => {
  
  try {
    const db = await getDb();

    console.log("Connected DB:", db.databaseName);

    // const collections = await db.listCollections().toArray();
    // console.log("Collections:", collections.map(c => c.name));

    // const allTokens = await db.collection("email_verification_tokens").find().toArray();
    // console.log("Tokens:", allTokens);
    const tokens = await db.collection("email_verification_tokens").find().toArray();
    console.log(tokens);

    const verificationTokensCollection = db.collection<EmailVerificationToken>(collections.emailVerificationTokens);
    const verificationToken = await verificationTokensCollection.findOne({ token });
    // console.log({verificationToken})
    return verificationToken;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const db = await getDb();
    const verificationTokensCollection = db.collection<EmailVerificationToken>(collections.emailVerificationTokens);
    const verificationToken = await verificationTokensCollection.findOne({ email });

    return verificationToken;
  } catch {
    return null;
  }
}