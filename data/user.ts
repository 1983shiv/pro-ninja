import { User, collections } from '@/drizzle/schema';
import { getDb } from '@/drizzle/db';

export const getUserByEmail = async (email: string) => {
    try {
        const db = await getDb();
        const collUser = db.collection<User>(collections.users);
        const user = await collUser.findOne({ email });
        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error);
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const db = await getDb();
        const collUser = db.collection<User>(collections.users);
        const user = await collUser.findOne({ _id: id } as any);

        return user;
    } catch (error) {
        console.error('Error in getUserById:', error);
        return null;
    }
};
