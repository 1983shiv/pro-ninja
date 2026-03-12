'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Key, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getAdminLicenses, updateLicense } from '@/actions/admin';

interface LicenseRow {
  _id: string;
  licenseKey: string;
  status: string;
  userId: string;
  userEmail: string;
  userName?: string | null;
  productName: string;
  tierType: string;
  activations: number;
  maxActivations: number;
  reviewsUsed: number;
  reviewLimit: number;
  expiresAt: string | null;
  createdAt: string | null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    'bg-green-100 text-green-700 border-green-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    expired:   'bg-amber-100 text-amber-700 border-amber-200',
    cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] ?? map.cancelled}`}>
      {status}
    </span>
  );
}

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actioning, setActioning] = useState<string | null>(null);

  const limit = 20;

  const loadLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminLicenses({ search, status: statusFilter, page, limit });
      if ('error' in res) throw new Error(res.error);
      setLicenses(res.licenses ?? []);
      setTotal(res.total ?? 0);
    } catch {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const r = await fetch(`/api/admin/licenses?${params.toString()}`);
      if (r.ok) {
        const data = await r.json();
        setLicenses(data.licenses ?? []);
        setTotal(data.total ?? 0);
      }
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { loadLicenses(); }, [loadLicenses]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  async function doAction(id: string, action: string, extra?: Record<string, string>) {
    setActioning(id);
    const act = action as 'revoke' | 'activate' | 'reset_usage' | 'extend';
    const res = await updateLicense(id, act, extra?.expiresAt);
    if ('error' in res) {
      await fetch(`/api/admin/licenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
    }
    setActioning(null);
    loadLicenses();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Licenses</h1>
            <p className="text-sm text-slate-500 mt-1">{total} license keys</p>
          </div>
          <button onClick={loadLicenses} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by license key…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading licenses…
            </div>
          ) : licenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Key className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No licenses found</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">License Key</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usage</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Expires</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {licenses.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-600 truncate max-w-40">{l.licenseKey}</td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/users/${l.userId}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs truncate max-w-[140px] block">
                        {l.userName ?? l.userEmail}
                      </Link>
                      {l.userName && <div className="text-xs text-slate-400 truncate max-w-[140px]">{l.userEmail}</div>}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">{l.productName}</td>
                    <td className="px-5 py-4"><StatusBadge status={l.status} /></td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      <div>{l.reviewsUsed}/{l.reviewLimit} reviews</div>
                      <div>{l.activations}/{l.maxActivations} sites</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{fmt(l.expiresAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {l.status !== 'active' && (
                          <button
                            onClick={() => doAction(l._id, 'activate')}
                            disabled={actioning === l._id}
                            className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors"
                          >
                            {actioning === l._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Activate'}
                          </button>
                        )}
                        {l.status === 'active' && (
                          <button
                            onClick={() => doAction(l._id, 'revoke')}
                            disabled={actioning === l._id}
                            className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            {actioning === l._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Revoke'}
                          </button>
                        )}
                        <button
                          onClick={() => doAction(l._id, 'reset_usage')}
                          disabled={actioning === l._id}
                          className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 text-sm text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors">Previous</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
