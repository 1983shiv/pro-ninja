import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import {
  getUsersCollection,
  getLicensesCollection,
  getTicketsCollection,
  getProductsCollection,
} from '@/drizzle/db';

// GET /api/admin/stats
export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const [usersCol, licensesCol, ticketsCol, productsCol] = await Promise.all([
      getUsersCollection(),
      getLicensesCollection(),
      getTicketsCollection(),
      getProductsCollection(),
    ]);

    const [totalUsers, activeLicenses, openTickets, totalProducts] = await Promise.all([
      usersCol.countDocuments({}),
      licensesCol.countDocuments({ status: 'active' }),
      ticketsCol.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      productsCol.countDocuments({}),
    ]);

    return NextResponse.json({ totalUsers, activeLicenses, openTickets, totalProducts });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
