'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Send, Loader2, MessageSquare,
  AlertCircle, ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { getTicketWithMessages, addReply, updateTicket } from '@/actions/support';
import { useSession } from 'next-auth/react';

interface TicketDetail {
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

interface Message {
  _id: string;
  senderId: string;
  senderRole: 'customer' | 'admin';
  message: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'] as const;
const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open:        'bg-green-100 text-green-700 border-green-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    resolved:    'bg-purple-100 text-purple-700 border-purple-200',
    closed:      'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? map.closed}`}>
      {status.replace('_', ' ')}
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
  return days < 7 ? `${days}d ago` : new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [replyText, setReplyText] = useState('');
  const [isReplying, startReply] = useTransition();
  const [replyError, setReplyError] = useState('');

  const [isUpdating, startUpdate] = useTransition();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  async function load() {
    setLoading(true);
    const res = await getTicketWithMessages(id);
    if ('error' in res) {
      setError(res.error as string);
    } else {
      setTicket(res.ticket as TicketDetail);
      setMessages(res.messages as Message[]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  // Scroll to bottom when messages load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close menus on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusMenu(false);
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) setShowPriorityMenu(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function handleReply() {
    if (!replyText.trim()) return;
    setReplyError('');
    startReply(async () => {
      const res = await addReply(id, { message: replyText.trim() });
      if ('error' in res) {
        setReplyError(res.error as string);
      } else {
        setReplyText('');
        load();
      }
    });
  }

  function handleStatusChange(newStatus: TicketDetail['status']) {
    setShowStatusMenu(false);
    startUpdate(async () => {
      await updateTicket(id, { status: newStatus });
      setTicket((t) => t ? { ...t, status: newStatus } : t);
    });
  }

  function handlePriorityChange(newPriority: TicketDetail['priority']) {
    setShowPriorityMenu(false);
    startUpdate(async () => {
      await updateTicket(id, { priority: newPriority });
      setTicket((t) => t ? { ...t, priority: newPriority } : t);
    });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600">{error || 'Ticket not found'}</p>
          <Link href="/admin/support" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">← Back to tickets</Link>
        </div>
      </div>
    );
  }

  const isClosed = ticket.status === 'closed';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <Link href="/admin/support" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-3 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All Tickets
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{ticket.subject}</h1>
            <p className="text-xs text-slate-400 mt-0.5">#{ticket.ticketNumber} · {ticket.category} · opened {timeAgo(ticket.createdAt)}</p>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status selector */}
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 text-sm"
              >
                <StatusBadge status={ticket.status} />
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                  {STATUS_OPTIONS.filter((s) => s !== ticket.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="flex w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 capitalize transition-colors"
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority selector */}
            <div className="relative" ref={priorityRef}>
              <button
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                disabled={isUpdating}
                className={`flex items-center gap-1 text-xs font-medium capitalize px-2.5 py-1 rounded-full border ${
                  ticket.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                  ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {ticket.priority} <ChevronDown className="w-3 h-3" />
              </button>
              {showPriorityMenu && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-28">
                  {PRIORITY_OPTIONS.filter((p) => p !== ticket.priority).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className="flex w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 capitalize transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages thread */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <MessageSquare className="w-8 h-8 mb-3 opacity-40" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((m) => {
            const isAdmin = m.senderRole === 'admin';
            return (
              <div
                key={m._id}
                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  isAdmin
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}>
                  <div className={`text-[10px] font-semibold mb-1 uppercase tracking-wide ${isAdmin ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {isAdmin ? 'Staff' : 'Customer'}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <p className={`text-[10px] mt-1.5 ${isAdmin ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
        {isClosed ? (
          <p className="text-sm text-center text-slate-400">
            This ticket is closed.{' '}
            <button
              onClick={() => handleStatusChange('open')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Re-open it
            </button>{' '}
            to reply.
          </p>
        ) : (
          <div className="flex items-end gap-3">
            <textarea
              rows={2}
              placeholder="Reply as staff…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply();
              }}
              disabled={isReplying}
              className="flex-1 resize-none text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleReply}
              disabled={isReplying || !replyText.trim()}
              className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        )}
        {replyError && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {replyError}
          </p>
        )}
      </div>
    </div>
  );
}
