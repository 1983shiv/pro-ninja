import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { getLicensesCollection, getProductsCollection } from '@/drizzle/db';
import LicensesClient from './licenses-client';

export default async function LicensesPage() {
  const user = await currentUser();
  if (!user?.id) redirect('/login');

  const [licensesCol, productsCol] = await Promise.all([
    getLicensesCollection(),
    getProductsCollection(),
  ]);

  const rawLicenses = await licensesCol.find({ userId: user.id }).toArray();

  // Attach product details to each license
  const licenses = await Promise.all(
    rawLicenses.map(async (lic) => {
      const product = await productsCol.findOne({ _id: lic.productId });
      return {
        id: lic._id,
        licenseKey: lic.licenseKey,
        status: lic.status,
        plan: product?.name ?? 'Free',
        tierType: product?.tierType ?? 'FREE',
        siteLimit: product?.siteLimit ?? 1,
        activatedDomains: lic.activatedDomains ?? [],
        activations: lic.activations,
        maxActivations: lic.maxActivations,
        reviewsUsed: lic.reviewsUsed,
        reviewLimit: lic.reviewLimit,
        expiresAt: lic.expiresAt ? lic.expiresAt.toISOString() : null,
        createdAt: lic.createdAt.toISOString(),
      };
    })
  );

  return <LicensesClient licenses={licenses} />;
}
