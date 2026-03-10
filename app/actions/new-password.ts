"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schema";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { getDb } from '@/drizzle/db';
import { User, PasswordResetToken, collections } from '@/drizzle/schema';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const db = await getDb();
  const usersCollection = db.collection<User>(collections.users);
  
  await usersCollection.updateOne(
    { _id: existingUser.id },
    { 
      $set: { 
        password: hashedPassword,
        updatedAt: new Date(),
      } 
    }
  );

  const passwordResetTokensCollection = db.collection<PasswordResetToken>(collections.passwordResetTokens);
  await passwordResetTokensCollection.deleteOne({ _id: existingToken._id });

  return { success: "Password updated!" };
};
