import { TwoFactorToken, collections } from '@/drizzle/schema';
import { getDb } from '@/drizzle/db';

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const db = await getDb();
    const twoFactorTokensCollection = db.collection<TwoFactorToken>(collections.twoFactorTokens);
    const twoFactorToken = await twoFactorTokensCollection.findOne({ token });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const db = await getDb();
    const twoFactorTokensCollection = db.collection<TwoFactorToken>(collections.twoFactorTokens);
    const twoFactorToken = await twoFactorTokensCollection.findOne({ email });

    return twoFactorToken;
  } catch {
    return null;
  }
};
