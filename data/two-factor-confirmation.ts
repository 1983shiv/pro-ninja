import { TwoFactorConfirmation, collections } from '@/drizzle/schema';
import { getDb } from '@/drizzle/db';

export const getTwoFactorConfirmationByUserId = async (
  userId: string
) => {
  try {
    const db = await getDb();
    const twoFactorConfirmationsCollection = db.collection<TwoFactorConfirmation>(collections.twoFactorConfirmations);
    const twoFactorConfirmation = await twoFactorConfirmationsCollection.findOne({ userId });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
