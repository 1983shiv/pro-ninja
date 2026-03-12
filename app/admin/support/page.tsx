'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { Search, MessageSquare, Loader2, RefreshCw, Eye, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getMyTickets, updateTicket } from '@/actions/support';

interface TicketRow {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    open:        { label: 'Open',        cls: 'bg-green-100 text-green-700 border-green-200' },
    in_progress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    resolved:    { label: 'Resolved',    cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    closed:      { label: 'Closed',      cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  };
  const s = map[status] ?? map.closed;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    high:   'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low:    'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${map[priority] ?? map.low}`}>
      {priority}
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
  return days < 7 ? `${days}d ago` : new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const loadTickets = useCallback(async () => {
    setLoading(true);
    // getMyTickets returns all tickets for ADMIN role
    const res = await getMyTickets();
    if ('tickets' in res) setTickets(res.tickets as TicketRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  async function setStatus(ticketId: string, status: string) {
    startTransition(async () => {
      await updateTicket(ticketId, { status: status as TicketRow['status'] });
      loadTickets();
    });
  }

  const filtered = tickets.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
            <p className="text-sm text-slate-500 mt-1">{filtered.length} of {tickets.length} tickets</p>
          </div>
          <button onClick={loadTickets} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by subject or ticket number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading tickets…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">{search || statusFilter || priorityFilter ? 'No matching tickets' : 'No tickets yet'}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ticket</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Updated</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 text-sm truncate max-w-[260px]">{t.subject}</div>
                      <div className="text-xs text-slate-400 mt-0.5">#{t.ticketNumber}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 capitalize">{t.category}</td>
                    <td className="px-5 py-4">
                      {/* Quick status change */}
                      <div className="relative group inline-block">
                        <button className="flex items-center gap-1" disabled={isPending}>
                          <StatusBadge status={t.status} />
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                        <div className="absolute left-0 top-full mt-1 z-20 hidden group-focus-within:block group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                          {(['open', 'in_progress', 'resolved', 'closed'] as const)
                            .filter((s) => s !== t.status)
                            .map((s) => (
                              <button
                                key={s}
                                onClick={() => setStatus(t._id, s)}
                                className="flex w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 capitalize transition-colors"
                              >
                                {s.replace('_', ' ')}
                              </button>
                            ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-5 py-4 text-xs text-slate-400">{timeAgo(t.updatedAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/support/${t._id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
