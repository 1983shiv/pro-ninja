"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { getDb } from '@/drizzle/db';
import { User, collections, newObjectId } from '@/drizzle/schema';
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const db = await getDb();
  const usersCollection = db.collection<User>(collections.users);

  const newUser: User = {
    _id: newObjectId(),
    name,
    email,
    password: hashedPassword,
    emailVerified: null,
    image: null,
    role: 'user',
    isTwoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await usersCollection.insertOne(newUser);

  try {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent! Please check your email to verify your account." };
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    return { 
      success: "Registration successful but failed to send verification email. Please use resend verification.",
      emailSent: false 
    };
  }
};
