'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { getDb } from '@/drizzle/db';
import { collections, RegisterSchema, User } from '@/drizzle/schema';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: 'Email already in use!' };
    }

    try {
        const db = await getDb();

        const usersCollection = db.collection<User>(collections.users);
        await usersCollection.insertOne({
            _id: new Date().getTime().toString(),
            name,
            email,
            password: hashedPassword,
            role: 'USER',
            isTwoFactorEnabled: false,
            emailVerified: null,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token );

        return { success: 'Confirmation email sent' };
    } catch (error: any) {
        console.error(
            'error during registeration, more detail below',
            error.message,
        );
        return { error: 'something went wrong during the registeration action' };
    }
};
