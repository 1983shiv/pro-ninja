import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getDownloadsCollection, getUsersCollection, getProductsCollection } from '@/drizzle/db';

// GET /api/admin/downloads
export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const [downloadsCol, usersCol, productsCol] = await Promise.all([
      getDownloadsCollection(),
      getUsersCollection(),
      getProductsCollection(),
    ]);

    const rawDownloads = await downloadsCol.find({}).sort({ downloadedAt: -1 }).limit(200).toArray();

    const downloads = await Promise.all(
      rawDownloads.map(async (d) => {
        const [user, product] = await Promise.all([
          usersCol.findOne({ _id: d.userId }, { projection: { email: 1 } }),
          productsCol.findOne({ _id: d.productId }, { projection: { name: 1 } }),
        ]);
        return {
          ...d,
          userEmail: user?.email ?? null,
          productName: product?.name ?? null,
          downloadedAt: d.downloadedAt?.toISOString() ?? null,
        };
      })
    );

    return NextResponse.json({ downloads });
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
