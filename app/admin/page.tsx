'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminStats } from '@/actions/admin';
import {
  Users,
  Key,
  Package,
  Download,
  MessageSquare,
  ClipboardList,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeLicenses: number;
  openTickets: number;
  totalProducts: number;
}

const sections = [
  {
    title: 'Users',
    desc: 'View, search, and manage all registered customers. Change roles and suspend accounts.',
    href: '/admin/users',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Licenses',
    desc: 'Browse all license keys. Revoke, extend, or reset usage on any license.',
    href: '/admin/licenses',
    icon: Key,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Products',
    desc: 'Edit pricing plans, review limits, and feature flags for each tier.',
    href: '/admin/products',
    icon: Package,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Downloads',
    desc: 'Manage plugin versions and control which builds are available to customers.',
    href: '/admin/downloads',
    icon: Download,
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Support Tickets',
    desc: 'Review open tickets, reply as staff, and update ticket status and priority.',
    href: '/admin/support',
    icon: MessageSquare,
    color: 'bg-red-50 text-red-600',
  },
  {
    title: 'Audit Logs',
    desc: 'Track all admin and system actions across users, licenses, and products.',
    href: '/admin/audit',
    icon: ClipboardList,
    color: 'bg-slate-100 text-slate-600',
  },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        if ('error' in data) throw new Error(data.error);
        setStats(data);
      })
      .catch(() =>
        fetch('/api/admin/stats')
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => { if (data) setStats(data); }),
      )
      .finally(() => setStatsLoading(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome to the admin panel. Use the sidebar or the cards below to navigate.
          </p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Users',     value: stats?.totalUsers },
            { label: 'Active Licenses', value: stats?.activeLicenses },
            { label: 'Open Tickets',    value: stats?.openTickets },
            { label: 'Products',        value: stats?.totalProducts },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
              {statsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-300 mt-1" />
              ) : (
                <p className="text-3xl font-bold text-slate-900">{value ?? '—'}</p>
              )}
            </div>
          ))}
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map(({ title, desc, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
