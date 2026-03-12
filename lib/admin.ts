import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Returns { session } for valid admin requests.
 * Returns { errorResponse } with 401/403 if not authorized.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (session.user.role !== 'ADMIN') {
    return { errorResponse: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session };
}
