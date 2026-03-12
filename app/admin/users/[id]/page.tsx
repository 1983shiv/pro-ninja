'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Key, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { getAdminUser, updateUserRole } from '@/actions/admin';

interface UserDetail {
  _id: string;
  email: string;
  name?: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  createdAt: string | null;
}

interface LicenseRow {
  _id: string;
  licenseKey: string;
  status: string;
  activations: number;
  maxActivations: number;
  reviewsUsed: number;
  reviewLimit: number;
  expiresAt: string | null;
  createdAt: string | null;
}

interface TicketRow {
  _id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
    expired:   'bg-amber-100 text-amber-700',
    cancelled: 'bg-slate-100 text-slate-500',
    open:      'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    resolved:  'bg-purple-100 text-purple-700',
    closed:    'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getAdminUser(id);
        if ('error' in res) throw new Error(res.error);
        setUser(res.user);
        setLicenses((res.licenses ?? []) as LicenseRow[]);
        setTickets((res.tickets ?? []) as TicketRow[]);
      } catch {
        const r = await fetch(`/api/admin/users/${id}`);
        if (r.ok) {
          const data = await r.json();
          setUser(data.user);
          setLicenses(data.licenses ?? []);
          setTickets(data.tickets ?? []);
        } else if (r.status === 404) {
          router.push('/admin/users');
        }
      }
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function changeRole(newRole: string) {
    setChangingRole(true);
    const res = await updateUserRole(id, newRole);
    if ('error' in res) {
      await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
    }
    setUser((u) => u ? { ...u, role: newRole } : u);
    setChangingRole(false);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Back */}
        <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Users
        </Link>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-900">{user.name ?? 'No name'}</h1>
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="text-xs text-slate-400">Joined {fmt(user.createdAt)}</span>
                <span className={`text-xs font-medium ${user.isTwoFactorEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                  2FA {user.isTwoFactorEnabled ? 'enabled' : 'disabled'}
                </span>
              </div>
            </div>
            {/* Role selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Role:</span>
              <select
                value={user.role}
                onChange={(e) => changeRole(e.target.value)}
                disabled={changingRole}
                className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="USER">USER</option>
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {changingRole && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            </div>
          </div>
        </div>

        {/* Licenses */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <Key className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Licenses ({licenses.length})</h2>
          </div>
          {licenses.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">No licenses</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Key</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usage</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {licenses.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600 truncate max-w-[180px]">{l.licenseKey}</td>
                    <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-5 py-3 text-xs text-slate-500">{l.reviewsUsed}/{l.reviewLimit} reviews · {l.activations}/{l.maxActivations} sites</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{fmt(l.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Tickets */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Support Tickets ({tickets.length})</h2>
          </div>
          {tickets.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">No tickets</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ticket</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Created</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-800 text-xs truncate max-w-[200px]">{t.subject}</div>
                      <div className="text-xs text-slate-400">#{t.ticketNumber}</div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 text-xs text-slate-500 capitalize">{t.priority}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{fmt(t.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/support/${t._id}`} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        View
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
