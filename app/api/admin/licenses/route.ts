import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getLicensesCollection, getUsersCollection, getProductsCollection } from '@/drizzle/db';

// GET /api/admin/licenses?search=&status=&page=1&limit=20
export async function GET(request: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
    const skip = (page - 1) * limit;

    const [licensesCol, usersCol, productsCol] = await Promise.all([
      getLicensesCollection(),
      getUsersCollection(),
      getProductsCollection(),
    ]);

    const filter: Record<string, any> = {};
    if (search) filter.licenseKey = { $regex: search, $options: 'i' };
    if (status) filter.status = status;

    const [rawLicenses, total] = await Promise.all([
      licensesCol.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      licensesCol.countDocuments(filter),
    ]);

    // Enrich with user email and product name
    const licenses = await Promise.all(
      rawLicenses.map(async (lic) => {
        const [user, product] = await Promise.all([
          usersCol.findOne({ _id: lic.userId }, { projection: { email: 1, name: 1 } }),
          productsCol.findOne({ _id: lic.productId }, { projection: { name: 1, tierType: 1 } }),
        ]);
        return {
          ...lic,
          userEmail: user?.email ?? '—',
          userName: user?.name ?? null,
          productName: product?.name ?? '—',
          tierType: product?.tierType ?? '—',
          createdAt: lic.createdAt?.toISOString() ?? null,
          updatedAt: lic.updatedAt?.toISOString() ?? null,
          expiresAt: lic.expiresAt?.toISOString() ?? null,
        };
      })
    );

    return NextResponse.json({ licenses, total, page, limit });
  } catch (error) {
    console.error('Error fetching admin licenses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
