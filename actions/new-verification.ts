"use server";

import { getDb } from '@/drizzle/db';
import { EmailVerificationToken, License, User, collections, newObjectId } from '@/drizzle/schema';
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";
import { generateLicenseKey } from "@/lib/tokens";
import { sendWelcomeEmail } from "@/lib/mail";

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
    { _id: existingUser._id },
    { $set: { 
        emailVerified: new Date(),
        email: existingToken.email,
        role: 'CUSTOMER',
        updatedAt: new Date(),
      } 
    }
  );

  const verificationTokensCollection = db.collection<EmailVerificationToken>(collections.emailVerificationTokens);
  await verificationTokensCollection.deleteOne({ _id: existingToken._id });

  // Generate a FREE license for the newly verified user
  const productsCollection = db.collection(collections.products);
  const freeProduct = await productsCollection.findOne({ tierType: 'FREE' });

  if (freeProduct) {
    const existingLicense = await db.collection<License>(collections.licenses).findOne({ userId: existingUser._id });

    if (!existingLicense) {
      const licenseKey = generateLicenseKey();
      const now = new Date();

      const newLicense: License = {
        _id: newObjectId(),
        licenseKey,
        userId: existingUser._id,
        productId: freeProduct._id,
        purchaseId: `free_registration_${existingUser._id}`,
        status: 'active',
        activations: 0,
        maxActivations: 1,
        activatedDomains: [],
        activatedAt: null,
        expiresAt: null, // FREE tier never expires
        lastValidatedAt: null,
        reviewsUsed: 0,
        reviewLimit: freeProduct.reviewLimit ?? 25,
        metadata: { source: 'free_registration' },
        createdAt: now,
        updatedAt: now,
      };

      await db.collection<License>(collections.licenses).insertOne(newLicense);

      // Send welcome email with license key (non-blocking — don't fail verification if email fails)
      try {
        await sendWelcomeEmail(existingToken.email, existingUser.name ?? 'there', licenseKey);
      } catch (emailError) {
        console.error('Welcome email failed to send:', emailError);
      }
    }
  }

  return { success: "Email verified!" };
};