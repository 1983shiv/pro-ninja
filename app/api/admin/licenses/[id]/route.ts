import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getLicensesCollection } from '@/drizzle/db';

// PATCH /api/admin/licenses/[id]
// body: { action: 'revoke' | 'activate' | 'reset_usage' | 'extend', expiresAt?: string }
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await request.json();
    const { action, expiresAt } = body as { action: string; expiresAt?: string };

    const licensesCol = await getLicensesCollection();
    const update: Record<string, any> = { updatedAt: new Date() };

    switch (action) {
      case 'revoke':
        update.status = 'suspended';
        break;
      case 'activate':
        update.status = 'active';
        break;
      case 'reset_usage':
        update.reviewsUsed = 0;
        break;
      case 'extend':
        if (!expiresAt) {
          return NextResponse.json({ error: 'expiresAt required for extend' }, { status: 400 });
        }
        update.expiresAt = new Date(expiresAt);
        update.status = 'active';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await licensesCol.updateOne({ _id: id }, { $set: update });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating license:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
