import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getUsersCollection } from '@/drizzle/db';

// GET /api/admin/users?search=&role=&page=1&limit=20
export async function GET(request: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')));
    const skip = (page - 1) * limit;

    const usersCol = await getUsersCollection();

    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;

    const [rawUsers, total] = await Promise.all([
      usersCol.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      usersCol.countDocuments(filter),
    ]);

    const users = rawUsers.map(({ password, twoFactorSecret, ...u }) => ({
      ...u,
      createdAt: u.createdAt?.toISOString() ?? null,
      updatedAt: u.updatedAt?.toISOString() ?? null,
    }));

    return NextResponse.json({ users, total, page, limit });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
