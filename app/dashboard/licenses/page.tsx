'use client';

import { useState } from 'react';
import { Search, Plus, Download, Copy, Globe, Rss, Store, Building2, ChevronLeft, ChevronRight, MoreVertical, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface License {
  id: string;
  key: string;
  maskedKey: string;
  status: 'active' | 'expired' | 'enterprise';
  plan: string;
  siteLimit: string;
  site: string;
  siteIcon: 'globe' | 'rss' | 'store' | 'building';
  nextBilling?: string;
  expired?: string;
}

const licenses: License[] = [
  {
    id: '1',
    key: 'ab12-cd34-ef56-89xy',
    maskedKey: 'ab12-****-****-89xy',
    status: 'active',
    plan: 'Pro Annual',
    siteLimit: '10 Sites Limit',
    site: 'https://mysite.com',
    siteIcon: 'globe',
    nextBilling: 'Oct 24, 2024',
  },
  {
    id: '2',
    key: 'cd34-ef56-gh78-12yz',
    maskedKey: 'cd34-****-****-12yz',
    status: 'active',
    plan: 'Starter Monthly',
    siteLimit: '1 Site Limit',
    site: 'https://blog.net',
    siteIcon: 'rss',
    nextBilling: 'Nov 01, 2024',
  },
  {
    id: '3',
    key: 'ef56-gh78-ij90-34ab',
    maskedKey: 'ef56-****-****-34ab',
    status: 'expired',
    plan: 'Pro Annual',
    siteLimit: '10 Sites Limit',
    site: 'https://shop.io',
    siteIcon: 'store',
    expired: 'Sep 15, 2023',
  },
  {
    id: '4',
    key: 'gh78-ij90-kl12-56cd',
    maskedKey: 'gh78-****-****-56cd',
    status: 'enterprise',
    plan: 'Enterprise',
    siteLimit: 'Unlimited Sites',
    site: 'https://corp.co',
    siteIcon: 'building',
    nextBilling: 'Dec 31, 2024',
  },
];

export default function LicensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleCopy = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSiteIcon = (iconType: string) => {
    switch (iconType) {
      case 'globe':
        return <Globe className="w-3.5 h-3.5" />;
      case 'rss':
        return <Rss className="w-3.5 h-3.5" />;
      case 'store':
        return <Store className="w-3.5 h-3.5" />;
      case 'building':
        return <Building2 className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Active
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            Expired
          </span>
        );
      case 'enterprise':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <Check className="w-3 h-3" />
            Enterprise
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">License Management</h1>
            <p className="text-slate-500 text-base">Manage and track your WordPress plugin license keys.</p>
          </div>
          <Button className="flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            Purchase New License
          </Button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 w-full gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition-shadow"
                  placeholder="Search license keys or domains..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative min-w-[140px]">
                <select
                  className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Export Action */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 w-[25%] min-w-[200px]">License Key</th>
                  <th className="px-6 py-4 w-[15%] min-w-[120px]">Status</th>
                  <th className="px-6 py-4 w-[20%] min-w-[150px]">Plan Type</th>
                  <th className="px-6 py-4 w-[25%] min-w-[200px]">Associated Site</th>
                  <th className="px-6 py-4 w-[15%] min-w-[120px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {licenses.map((license) => (
                  <tr
                    key={license.id}
                    className={`group hover:bg-slate-50/50 transition-colors ${
                      license.status === 'expired' ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    {/* License Key */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-sm font-medium px-2 py-1 rounded border ${
                            license.status === 'expired'
                              ? 'text-gray-500 bg-gray-100 border-gray-200 opacity-75'
                              : 'text-slate-900 bg-gray-100 border-gray-200'
                          }`}
                        >
                          {license.maskedKey}
                        </span>
                        <button
                          className={`p-1 rounded transition-colors ${
                            license.status === 'expired'
                              ? 'text-gray-300 hover:text-indigo-600'
                              : 'text-gray-400 hover:text-indigo-600'
                          }`}
                          title="Copy Key"
                          onClick={() => handleCopy(license.key, license.id)}
                        >
                          {copiedId === license.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {license.nextBilling && (
                        <p className="text-xs text-slate-500 mt-1">
                          Next billing: {license.nextBilling}
                        </p>
                      )}
                      {license.expired && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          Expired: {license.expired}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(license.status)}</td>

                    {/* Plan Type */}
                    <td className="px-6 py-4">
                      <div className={`flex flex-col ${license.status === 'expired' ? 'opacity-60' : ''}`}>
                        <span className="text-sm font-medium text-slate-900">{license.plan}</span>
                        <span className="text-xs text-slate-500">{license.siteLimit}</span>
                      </div>
                    </td>

                    {/* Associated Site */}
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${license.status === 'expired' ? 'opacity-60' : ''}`}>
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center ${
                            license.siteIcon === 'globe'
                              ? 'bg-blue-50 text-blue-600'
                              : license.siteIcon === 'rss'
                              ? 'bg-purple-50 text-purple-600'
                              : license.siteIcon === 'store'
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          {getSiteIcon(license.siteIcon)}
                        </div>
                        {license.status === 'expired' ? (
                          <span className="text-sm text-slate-500 truncate max-w-[180px]">{license.site}</span>
                        ) : (
                          <Link
                            href="#"
                            className="text-sm text-indigo-600 hover:underline font-medium truncate max-w-[180px]"
                          >
                            {license.site}
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {license.status === 'expired' ? (
                        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mr-2 border border-indigo-600/20 px-3 py-1.5 rounded-md hover:bg-indigo-600/5 transition-colors">
                          Renew Now
                        </button>
                      ) : (
                        <div className="relative inline-block text-left">
                          <button
                            className="p-2 rounded-lg text-slate-500 hover:bg-gray-100 hover:text-slate-900 transition-colors"
                            onClick={() => setOpenMenuId(openMenuId === license.id ? null : license.id)}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openMenuId === license.id && (
                            <div className="absolute right-0 mt-0 w-36 rounded-lg bg-white shadow-lg border border-slate-200 z-20 py-1 origin-top-right">
                              <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-gray-50">
                                Manage
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-gray-50">
                                Deactivate
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                Revoke
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">1</span> to{' '}
              <span className="font-semibold text-slate-900">4</span> of{' '}
              <span className="font-semibold text-slate-900">12</span> licenses
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-gray-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm">
                1
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-gray-50 hover:text-slate-900 text-sm">
                2
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-gray-50 hover:text-slate-900 text-sm">
                3
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-gray-50 hover:text-slate-900">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
