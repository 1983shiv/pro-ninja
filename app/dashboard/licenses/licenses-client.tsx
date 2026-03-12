'use client';

import { useState } from 'react';
import { Search, Copy, Globe, ChevronDown, Check, MoreVertical } from 'lucide-react';

export interface LicenseRow {
  id: string;
  licenseKey: string;
  status: 'active' | 'expired' | 'suspended' | 'cancelled';
  plan: string;
  tierType: string;
  siteLimit: number;
  activatedDomains: string[];
  activations: number;
  maxActivations: number;
  reviewsUsed: number;
  reviewLimit: number;
  expiresAt: string | null;
  createdAt: string;
}

interface Props {
  licenses: LicenseRow[];
}

function maskKey(key: string): string {
  const parts = key.split('-');
  if (parts.length < 4) return key;
  return `${parts[0]}-****-****-${parts[parts.length - 1]}`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Active
      </span>
    );
  }
  if (status === 'expired') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function LicensesClient({ licenses }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleCopy = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = licenses.filter((lic) => {
    const matchesSearch =
      lic.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.activatedDomains.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || lic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">License Management</h1>
            <p className="text-slate-500 text-base">Manage and track your WordPress plugin license keys.</p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400"
                placeholder="Search license key or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative min-w-[140px]">
              <select
                className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No licenses found</p>
              <p className="text-slate-400 text-sm mt-1">
                {licenses.length === 0
                  ? 'Your free license will appear here once your email is verified.'
                  : 'Try adjusting your search or filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">License Key</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Usage</th>
                    <th className="px-6 py-4">Activated Domain</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((lic) => (
                    <tr key={lic.id} className="group hover:bg-slate-50/50 transition-colors">
                      {/* License Key */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium px-2 py-1 rounded border text-slate-900 bg-gray-100 border-gray-200">
                            {maskKey(lic.licenseKey)}
                          </span>
                          <button
                            className="p-1 rounded text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Copy license key"
                            onClick={() => handleCopy(lic.licenseKey, lic.id)}
                          >
                            {copiedId === lic.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Since {new Date(lic.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={lic.status} />
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{lic.plan}</span>
                        <p className="text-xs text-slate-500">
                          {lic.siteLimit === 0 ? 'Unlimited sites' : `${lic.siteLimit} site${lic.siteLimit > 1 ? 's' : ''}`}
                        </p>
                      </td>

                      {/* Reviews Usage */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 min-w-[120px]">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>{lic.reviewsUsed} used</span>
                            <span>{lic.reviewLimit === 0 ? '∞' : lic.reviewLimit} limit</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full transition-all"
                              style={{
                                width: lic.reviewLimit === 0
                                  ? '0%'
                                  : `${Math.min(100, (lic.reviewsUsed / lic.reviewLimit) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Activated Domain */}
                      <td className="px-6 py-4">
                        {lic.activatedDomains.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">Not activated yet</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {lic.activatedDomains.map((domain) => (
                              <span key={domain} className="text-sm text-indigo-600 font-medium truncate max-w-[180px]">
                                {domain}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            className="p-2 rounded-lg text-slate-500 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                            onClick={() => setOpenMenuId(openMenuId === lic.id ? null : lic.id)}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenuId === lic.id && (
                            <div className="absolute right-0 mt-1 w-36 rounded-lg bg-white shadow-lg border border-slate-200 z-20 py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-gray-50"
                                onClick={() => handleCopy(lic.licenseKey, lic.id)}
                              >
                                Copy Key
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{licenses.length}</span> license{licenses.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
