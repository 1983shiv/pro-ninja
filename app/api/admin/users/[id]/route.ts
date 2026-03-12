import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getUsersCollection, getLicensesCollection, getTicketsCollection } from '@/drizzle/db';

// GET /api/admin/users/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const [usersCol, licensesCol, ticketsCol] = await Promise.all([
      getUsersCollection(),
      getLicensesCollection(),
      getTicketsCollection(),
    ]);

    const rawUser = await usersCol.findOne({ _id: id });
    if (!rawUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { password, twoFactorSecret, ...user } = rawUser;

    const [licenses, tickets] = await Promise.all([
      licensesCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
      ticketsCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
    ]);

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt?.toISOString() ?? null,
        updatedAt: user.updatedAt?.toISOString() ?? null,
      },
      licenses: licenses.map((l) => ({
        ...l,
        createdAt: l.createdAt?.toISOString() ?? null,
        updatedAt: l.updatedAt?.toISOString() ?? null,
        expiresAt: l.expiresAt?.toISOString() ?? null,
      })),
      tickets: tickets.map((t) => ({
        ...t,
        createdAt: t.createdAt?.toISOString() ?? null,
        updatedAt: t.updatedAt?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    console.error('Error fetching user detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id]  — update role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;
    const body = await request.json();
    const { role } = body as { role?: string };

    const allowed = ['USER', 'CUSTOMER', 'ADMIN'];
    if (role !== undefined && !allowed.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const usersCol = await getUsersCollection();
    const update: Record<string, any> = { updatedAt: new Date() };
    if (role) update.role = role;

    const result = await usersCol.updateOne({ _id: id }, { $set: update });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
