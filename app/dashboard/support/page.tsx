'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Search, Wrench, FileText, Sparkles, HelpCircle, Eye, Plus, ArrowRight,
  ArrowLeft, Send, X, AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  createTicket,
  getMyTickets,
  getTicketWithMessages,
  addReply,
} from '@/actions/support';

// ─── Types (serialised from server — dates are ISO strings) ─────────────────

interface TicketRow {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  senderId: string;
  senderRole: 'customer' | 'admin';
  message: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    open:        { label: 'Open',        cls: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500' },
    in_progress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700 border-blue-200',      dot: 'bg-blue-500' },
    resolved:    { label: 'Resolved',    cls: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    closed:      { label: 'Closed',      cls: 'bg-gray-100 text-gray-600 border-gray-200',       dot: 'bg-gray-400' },
  };
  const s = map[status] ?? map.closed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  // view
  const [view, setView] = useState<'list' | 'thread'>('list');
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // list data
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  // thread data
  const [activeTicket, setActiveTicket] = useState<TicketRow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);

  // create form
  const [form, setForm] = useState({ subject: '', category: 'technical', message: '' });
  const [formError, setFormError] = useState('');
  const [isPending, startCreate] = useTransition();

  // reply
  const [replyText, setReplyText] = useState('');
  const [isReplying, startReply] = useTransition();

  // load tickets on mount
  useEffect(() => { loadTickets(); }, []);

  async function loadTickets() {
    setTicketsLoading(true);
    const res = await getMyTickets();
    if ('tickets' in res) setTickets(res.tickets as TicketRow[]);
    setTicketsLoading(false);
  }

  async function openThread(ticket: TicketRow) {
    setActiveTicket(ticket);
    setView('thread');
    setThreadLoading(true);
    const res = await getTicketWithMessages(ticket._id);
    if ('messages' in res && res.messages) {
      setMessages(res.messages as Message[]);
      if (res.ticket) setActiveTicket(res.ticket as TicketRow);
    }
    setThreadLoading(false);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    startCreate(async () => {
      const res = await createTicket({
        subject: form.subject,
        category: form.category as any,
        message: form.message,
      });
      if ('error' in res && res.error) {
        setFormError(res.error);
      } else {
        setShowCreate(false);
        setForm({ subject: '', category: 'technical', message: '' });
        await loadTickets();
      }
    });
  }

  function openWithCategory(category: string) {
    setForm((f) => ({ ...f, category }));
    setShowCreate(true);
  }

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;
    startReply(async () => {
      const res = await addReply(activeTicket._id, { message: replyText });
      if (!('error' in res && res.error)) {
        setReplyText('');
        const refreshed = await getTicketWithMessages(activeTicket._id);
        if ('messages' in refreshed && refreshed.messages) {
          setMessages(refreshed.messages as Message[]);
          if (refreshed.ticket) setActiveTicket(refreshed.ticket as TicketRow);
        }
      }
    });
  }

  const filtered = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Thread view ────────────────────────────────────────────────────────────
  if (view === 'thread' && activeTicket) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
          <button
            onClick={() => { setView('list'); setActiveTicket(null); setMessages([]); }}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Support
          </button>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400">{activeTicket.ticketNumber}</span>
                <StatusBadge status={activeTicket.status} />
              </div>
              <h1 className="text-lg font-bold text-slate-900 truncate">{activeTicket.subject}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Opened {timeAgo(activeTicket.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {threadLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex gap-3 ${msg.senderRole === 'admin' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.senderRole === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {msg.senderRole === 'admin' ? 'S' : 'Y'}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.senderRole === 'admin' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs mt-1.5 ${msg.senderRole === 'admin' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {timeAgo(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reply bar */}
        {activeTicket.status !== 'closed' ? (
          <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3">
            <form onSubmit={handleReply} className="max-w-3xl mx-auto flex gap-2">
              <textarea
                className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                placeholder="Type your reply… (Shift+Enter for new line)"
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply(e as any);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={isReplying || !replyText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl self-end h-10"
              >
                {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        ) : (
          <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-4 py-3 text-center text-sm text-slate-500">
            This ticket is closed.
          </div>
        )}
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero / Search */}
      <div className="relative w-full bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-indigo-600/5" />
        <div className="relative flex flex-col items-center justify-center py-12 px-4 md:px-10 text-center">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
            How can we help?
          </h1>
          <p className="text-slate-500 text-base mb-6 max-w-2xl">
            Search your tickets or browse categories for help with installation, API keys, billing, and troubleshooting.
          </p>
          <div className="w-full max-w-2xl">
            <div className="flex w-full items-center rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600 transition-all">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                className="w-full bg-transparent border-none py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-0 text-sm focus:outline-none"
                placeholder="Search tickets by subject or ID…"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 flex flex-col gap-12">

          {/* Category Cards — Billing hidden until payment integration */}
          <section>
            <h2 className="text-slate-900 text-2xl font-bold tracking-tight mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {([
                {
                  icon: Wrench,
                  title: 'Technical Support',
                  category: 'technical',
                  desc: 'Plugin installation, WordPress conflicts, API errors, and configuration settings.',
                  cta: 'Open Ticket',
                  hidden: false,
                },
                {
                  icon: FileText,
                  title: 'Billing Inquiry',
                  category: 'billing',
                  desc: 'Subscription plans, invoice downloads, payment methods, and refunds.',
                  cta: 'Open Ticket',
                  hidden: true, // hidden until payment integration
                },
                {
                  icon: Sparkles,
                  title: 'Feature Request',
                  category: 'feature',
                  desc: 'Submit feature suggestions or vote on existing roadmap items.',
                  cta: 'Submit Request',
                  hidden: false,
                },
                {
                  icon: HelpCircle,
                  title: 'Other',
                  category: 'other',
                  desc: 'General questions, onboarding help, or anything that doesn\'t fit above.',
                  cta: 'Open Ticket',
                  hidden: false,
                },
              ] as const).filter((c) => !c.hidden).map(({ icon: Icon, title, category, desc, cta }) => (
                <button
                  key={title}
                  onClick={() => openWithCategory(category)}
                  className="group flex flex-col p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-600/30 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm grow">{desc}</p>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-semibold">
                    {cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Ticket list */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 text-2xl font-bold tracking-tight">My Tickets</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> New Ticket
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {ticketsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <AlertCircle className="w-10 h-10 mb-3" />
                  <p className="text-sm font-medium">
                    {searchQuery ? 'No tickets match your search' : 'No tickets yet'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowCreate(true)}
                      className="mt-3 text-sm text-indigo-600 hover:underline"
                    >
                      Open your first ticket
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Ticket ID</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-2/5">Subject</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Updated</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {filtered.map((ticket) => (
                        <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-slate-400 text-xs">{ticket.ticketNumber}</td>
                          <td className="p-4 font-medium text-slate-900">{ticket.subject}</td>
                          <td className="p-4 text-slate-500 capitalize">{ticket.category.replace('_', ' ')}</td>
                          <td className="p-4 text-slate-500">{timeAgo(ticket.updatedAt)}</td>
                          <td className="p-4"><StatusBadge status={ticket.status} /></td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => openThread(ticket)}
                              className="text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Create ticket modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Open New Ticket</h2>
              <button
                onClick={() => { setShowCreate(false); setFormError(''); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Briefly describe your issue"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="technical">Technical Support</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  minLength={20}
                  rows={5}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder-slate-400"
                  placeholder="Describe your issue in detail. Include error messages, steps to reproduce, and any other relevant info."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
              )}
              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowCreate(false); setFormError(''); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




