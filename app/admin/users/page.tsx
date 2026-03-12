'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, User, ChevronDown, Check, Loader2, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';
import { getAdminUsers, updateUserRole } from '@/actions/admin';

interface UserRow {
  _id: string;
  email: string;
  name?: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  createdAt: string | null;
}

const ROLES = ['', 'USER', 'CUSTOMER', 'ADMIN'] as const;

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN:    'bg-red-100 text-red-700 border-red-200',
    CUSTOMER: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    USER:     'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[role] ?? map.USER}`}>
      {role}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const limit = 20;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ search, role: roleFilter, page, limit });
      if ('error' in res) throw new Error(res.error);
      setUsers(res.users ?? []);
      setTotal(res.total ?? 0);
    } catch {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const r = await fetch(`/api/admin/users?${params.toString()}`);
      if (r.ok) {
        const data = await r.json();
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
      }
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // debounce search — reset to page 1 when search/filter changes
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  async function changeRole(userId: string, newRole: string) {
    setChangingRole(userId);
    const res = await updateUserRole(userId, newRole);
    if ('error' in res) {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
    }
    setChangingRole(null);
    loadUsers();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500 mt-1">{total} registered accounts</p>
          </div>
          <button onClick={loadUsers} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All roles</option>
            <option value="USER">USER</option>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading users…
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <User className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">User</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">Role</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">2FA</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">Joined</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 truncate max-w-[220px]">{u.name ?? '—'}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[220px]">{u.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <RoleBadge role={u.role} />
                        {/* Role change dropdown */}
                        <div className="relative group">
                          <button
                            title="Change role"
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute left-0 top-full mt-1 z-20 hidden group-focus-within:block group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-32">
                            {(['USER', 'CUSTOMER', 'ADMIN'] as const).filter((r) => r !== u.role).map((r) => (
                              <button
                                key={r}
                                onClick={() => changeRole(u._id, r)}
                                disabled={changingRole === u._id}
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                              >
                                {changingRole === u._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 opacity-0" />}
                                Set {r}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium ${u.isTwoFactorEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                        {u.isTwoFactorEnabled ? 'On' : 'Off'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/users/${u._id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
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
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
