import { getDb } from '@/drizzle/db';
import { Account, collections } from '@/drizzle/schema';
import { ObjectId } from 'mongodb';

export const getAccountByUserId = async (userId: string) => {
    try {
        const db = await getDb();
        const accountsCollection = db.collection<Account>(collections.accounts);
        
        // Try both string and ObjectId formats
        let account = await accountsCollection.findOne({ userId: userId });
        
        if (!account) {
            const objectId = new ObjectId(userId);
            account = await accountsCollection.findOne({ userId: objectId } as any);
        }
        
        if (!account) {
            const allAccounts = await accountsCollection.find({}).limit(5).toArray();
        }
        
        return account;
    } catch (error) {
        console.error('❌ Error in getAccountByUserId:', error);
        return null;
    }
};
