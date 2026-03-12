import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getLicensesCollection } from '@/drizzle/db';

// GET /api/dashboard/usage
// Returns the current user's review usage from their primary active license.
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const licensesCol = await getLicensesCollection();

    // Prefer active license; fall back to any license
    const licenses = await licensesCol
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    const primary =
      licenses.find((l) => l.status === 'active') ?? licenses[0] ?? null;

    if (!primary) {
      return NextResponse.json({
        reviewsUsed: 0,
        reviewLimit: 0,
        plan: 'FREE',
      });
    }

    return NextResponse.json({
      reviewsUsed: primary.reviewsUsed ?? 0,
      reviewLimit: primary.reviewLimit ?? 0,
      plan: primary.plan ?? 'FREE',
    });
  } catch (error) {
    console.error('Failed to fetch usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
