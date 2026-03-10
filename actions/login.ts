"use server";

import * as z from "zod";
import { getDb } from "@/drizzle/db";
import { collections, LoginSchema, TwoFactorToken } from "@/drizzle/schema";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { 
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/mail";



import { 
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens";

import { 
  getTwoFactorConfirmationByUserId
} from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(
        existingUser.email
      );

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      const db = await getDb();
      try {

        const twoFactorTokenCol = db.collection<TwoFactorToken>(collections.twoFactorTokens);
        await twoFactorTokenCol.deleteOne({ _id: twoFactorToken._id});

        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser._id);

        const twoFactorConfirmationCol = db.collection(collections.twoFactorConfirmations);

        if(existingConfirmation){
          await twoFactorConfirmationCol.deleteOne({ userId: existingConfirmation._id})
        }

        await twoFactorConfirmationCol.insertOne({
          userId: existingUser._id,
        })
     
      } catch (error: any) {
        console.error("something went wrong with login action", error.message)
      }

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );

      return { twoFactor: true };
    }
  }

  return { validated: true };
};
