import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTicketsCollection, getTicketMessagesCollection } from '@/drizzle/db';
import { UpdateTicketSchema } from '@/drizzle/schema';

// GET /api/support/tickets/[id] — get ticket + messages
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const { id } = params;

  try {
    const ticketsCol = await getTicketsCollection();
    const messagesCol = await getTicketMessagesCollection();

    const ticket = await ticketsCol.findOne({ _id: id });
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    if (ticket.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await messagesCol.find({ ticketId: id }).sort({ createdAt: 1 }).toArray();

    return NextResponse.json({ ticket, messages });
  } catch {
    return NextResponse.json({ error: 'Failed to load ticket' }, { status: 500 });
  }
}

// PATCH /api/support/tickets/[id] — update status or priority (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = UpdateTicketSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });

  const { id } = params;

  try {
    const ticketsCol = await getTicketsCollection();

    const ticket = await ticketsCol.findOne({ _id: id });
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    await ticketsCol.updateOne(
      { _id: id },
      { $set: { ...parsed.data, updatedAt: new Date() } },
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
