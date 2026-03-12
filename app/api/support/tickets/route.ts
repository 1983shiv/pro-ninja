import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTicketsCollection, getTicketMessagesCollection } from '@/drizzle/db';
import { SupportTicket, TicketMessage, newObjectId, CreateTicketSchema } from '@/drizzle/schema';

// GET /api/support/tickets — list own tickets (or all for admin)
export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;

  try {
    const ticketsCol = await getTicketsCollection();
    const query = session.user.role === 'ADMIN' ? {} : { userId };
    const tickets = await ticketsCol.find(query).sort({ updatedAt: -1 }).toArray();
    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: 'Failed to load tickets' }, { status: 500 });
  }
}

// POST /api/support/tickets — create new ticket
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = CreateTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid fields' },
      { status: 400 },
    );
  }

  const { subject, category, message } = parsed.data;
  const userId = (session.user as any).id as string;

  try {
    const ticketsCol = await getTicketsCollection();
    const messagesCol = await getTicketMessagesCollection();

    const count = await ticketsCol.countDocuments();
    const ticketNumber = `T-${String(count + 1001).padStart(5, '0')}`;

    const now = new Date();
    const ticketId = newObjectId();

    const ticket: SupportTicket = {
      _id: ticketId,
      ticketNumber,
      userId,
      subject,
      category,
      status: 'open',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    };

    await ticketsCol.insertOne(ticket);

    const firstMessage: TicketMessage = {
      _id: newObjectId(),
      ticketId,
      senderId: userId,
      senderRole: 'customer',
      message,
      createdAt: now,
    };

    await messagesCol.insertOne(firstMessage);

    return NextResponse.json({ success: true, ticketId, ticketNumber, ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
