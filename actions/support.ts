'use server';

import * as z from 'zod';
import { auth } from '@/auth';
import { getTicketsCollection, getTicketMessagesCollection } from '@/drizzle/db';
import {
  SupportTicket,
  TicketMessage,
  newObjectId,
  CreateTicketSchema,
  AddReplySchema,
  UpdateTicketSchema,
} from '@/drizzle/schema';

// ─── Auth helper ────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

// ─── Create a new ticket (customer) ─────────────────────────────────────────

export async function createTicket(values: z.infer<typeof CreateTicketSchema>) {
  const user = await requireAuth();
  if (!user) return { error: 'Unauthorized' };

  const parsed = CreateTicketSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid fields' };

  const { subject, category, message } = parsed.data;
  const userId = (user as any).id as string;

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

    return { success: true, ticketId, ticketNumber };
  } catch (e) {
    console.error('createTicket:', e);
    return { error: 'Failed to create ticket' };
  }
}

// ─── List tickets (own for customer, all for admin) ──────────────────────────

export async function getMyTickets() {
  const user = await requireAuth();
  if (!user) return { error: 'Unauthorized' };

  const userId = (user as any).id as string;

  try {
    const ticketsCol = await getTicketsCollection();
    const query = user.role === 'ADMIN' ? {} : { userId };
    const tickets = await ticketsCol.find(query).sort({ updatedAt: -1 }).toArray();

    // Serialize Date objects for client components
    return {
      tickets: tickets.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    };
  } catch (e) {
    console.error('getMyTickets:', e);
    return { error: 'Failed to load tickets' };
  }
}

// ─── Get single ticket + all messages ────────────────────────────────────────

export async function getTicketWithMessages(ticketId: string) {
  const user = await requireAuth();
  if (!user) return { error: 'Unauthorized' };

  const userId = (user as any).id as string;

  try {
    const ticketsCol = await getTicketsCollection();
    const messagesCol = await getTicketMessagesCollection();

    const ticket = await ticketsCol.findOne({ _id: ticketId });
    if (!ticket) return { error: 'Ticket not found' };

    if (ticket.userId !== userId && user.role !== 'ADMIN') {
      return { error: 'Forbidden' };
    }

    const messages = await messagesCol
      .find({ ticketId })
      .sort({ createdAt: 1 })
      .toArray();

    return {
      ticket: {
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
      },
      messages: messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    console.error('getTicketWithMessages:', e);
    return { error: 'Failed to load ticket' };
  }
}

// ─── Add a reply to a ticket ─────────────────────────────────────────────────

export async function addReply(
  ticketId: string,
  values: z.infer<typeof AddReplySchema>,
) {
  const user = await requireAuth();
  if (!user) return { error: 'Unauthorized' };

  const parsed = AddReplySchema.safeParse(values);
  if (!parsed.success) return { error: 'Invalid fields' };

  const userId = (user as any).id as string;

  try {
    const ticketsCol = await getTicketsCollection();
    const messagesCol = await getTicketMessagesCollection();

    const ticket = await ticketsCol.findOne({ _id: ticketId });
    if (!ticket) return { error: 'Ticket not found' };

    if (ticket.userId !== userId && user.role !== 'ADMIN') {
      return { error: 'Forbidden' };
    }

    if (ticket.status === 'closed') {
      return { error: 'Cannot reply to a closed ticket' };
    }

    const now = new Date();
    const msg: TicketMessage = {
      _id: newObjectId(),
      ticketId,
      senderId: userId,
      senderRole: user.role === 'ADMIN' ? 'admin' : 'customer',
      message: parsed.data.message,
      createdAt: now,
    };

    await messagesCol.insertOne(msg);

    // Auto status transitions:
    // customer replies to resolved → reopen
    // admin replies to open → mark in_progress
    let newStatus = ticket.status;
    if (user.role !== 'ADMIN' && ticket.status === 'resolved') newStatus = 'open';
    else if (user.role === 'ADMIN' && ticket.status === 'open') newStatus = 'in_progress';

    await ticketsCol.updateOne(
      { _id: ticketId },
      { $set: { status: newStatus, updatedAt: now } },
    );

    return { success: true };
  } catch (e) {
    console.error('addReply:', e);
    return { error: 'Failed to add reply' };
  }
}

// ─── Update ticket status / priority (admin only) ────────────────────────────

export async function updateTicket(
  ticketId: string,
  values: z.infer<typeof UpdateTicketSchema>,
) {
  const user = await requireAuth();
  if (!user) return { error: 'Unauthorized' };
  if (user.role !== 'ADMIN') return { error: 'Forbidden' };

  const parsed = UpdateTicketSchema.safeParse(values);
  if (!parsed.success) return { error: 'Invalid fields' };

  try {
    const ticketsCol = await getTicketsCollection();

    const ticket = await ticketsCol.findOne({ _id: ticketId });
    if (!ticket) return { error: 'Ticket not found' };

    await ticketsCol.updateOne(
      { _id: ticketId },
      { $set: { ...parsed.data, updatedAt: new Date() } },
    );

    return { success: true };
  } catch (e) {
    console.error('updateTicket:', e);
    return { error: 'Failed to update ticket' };
  }
}
