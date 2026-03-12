import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTicketsCollection, getTicketMessagesCollection } from '@/drizzle/db';
import { TicketMessage, newObjectId, AddReplySchema } from '@/drizzle/schema';

// POST /api/support/tickets/[id]/messages — add reply to ticket
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = AddReplySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });

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

    if (ticket.status === 'closed') {
      return NextResponse.json({ error: 'Cannot reply to a closed ticket' }, { status: 400 });
    }

    const now = new Date();
    const msg: TicketMessage = {
      _id: newObjectId(),
      ticketId: id,
      senderId: userId,
      senderRole: session.user.role === 'ADMIN' ? 'admin' : 'customer',
      message: parsed.data.message,
      createdAt: now,
    };

    await messagesCol.insertOne(msg);

    let newStatus = ticket.status;
    if (session.user.role !== 'ADMIN' && ticket.status === 'resolved') newStatus = 'open';
    else if (session.user.role === 'ADMIN' && ticket.status === 'open') newStatus = 'in_progress';

    await ticketsCol.updateOne(
      { _id: id },
      { $set: { status: newStatus, updatedAt: now } },
    );

    return NextResponse.json({ success: true, message: msg }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}
