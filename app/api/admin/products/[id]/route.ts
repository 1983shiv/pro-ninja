import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getProductsCollection } from '@/drizzle/db';

// PATCH /api/admin/products/[id]
// Update any editable product fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await request.json();

    // Only allow safe product fields to be updated
    const {
      name, description, shortDesc,
      price, reviewLimit, siteLimit,
      isActive, isFeatured,
    } = body as Record<string, any>;

    const update: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) update.name = String(name);
    if (description !== undefined) update.description = String(description);
    if (shortDesc !== undefined) update.shortDesc = shortDesc ? String(shortDesc) : null;
    if (price !== undefined) update.price = Number(price);
    if (reviewLimit !== undefined) update.reviewLimit = Number(reviewLimit);
    if (siteLimit !== undefined) update.siteLimit = Number(siteLimit);
    if (isActive !== undefined) update.isActive = Boolean(isActive);
    if (isFeatured !== undefined) update.isFeatured = Boolean(isFeatured);

    const productsCol = await getProductsCollection();
    const result = await productsCol.updateOne({ _id: id }, { $set: update });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
