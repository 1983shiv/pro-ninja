'use client';

import { Key, Star, Gauge, Calendar, TrendingUp, ArrowRight, Copy, MoreHorizontal, Plus, Download, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  progress?: number;
  iconBg: string;
}

function StatCard({ title, value, subtitle, icon, badge, progress, iconBg }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          {icon}
        </div>
        {badge}
      </div>
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, here's what's happening with your licenses.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Licenses"
            value={3}
            icon={<Key className="w-5 h-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            badge={
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +1 this month
              </span>
            }
          />
          <StatCard
            title="Reviews Used"
            value={
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">450</span>
                <span className="text-sm text-slate-400 font-medium">/ 500</span>
              </div>
            }
            icon={<Star className="w-5 h-5 text-indigo-600" />}
            iconBg="bg-indigo-50"
            badge={<span className="text-xs font-medium text-slate-500">Monthly Cap</span>}
            progress={90}
          />
          <StatCard
            title="Quota Remaining"
            value={50}
            subtitle="Only 10% left for this period"
            icon={<Gauge className="w-5 h-5 text-amber-600" />}
            iconBg="bg-amber-50"
            badge={
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                Low Quota
              </span>
            }
          />
          <StatCard
            title="Next Billing"
            value="Mar 15"
            subtitle="Starter Plan ($19.00)"
            icon={<Calendar className="w-5 h-5 text-slate-600" />}
            iconBg="bg-slate-100"
            badge={
              <Link href="/dashboard/billing" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Manage
              </Link>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Licenses Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold text-slate-800">Recent Licenses</h3>
                <Link
                  href="/dashboard/licenses"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4 font-semibold">Key</th>
                      <th className="px-6 py-4 font-semibold">Plan</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Sites</th>
                      <th className="px-6 py-4 font-semibold">Expires</th>
                      <th className="px-6 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* License Row 1 */}
                    <tr className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            AIRS-....-90AB
                          </span>
                          <button className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          STARTER
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">1 / 1</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Mar 15, 2026</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>

                    {/* License Row 2 */}
                    <tr className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            AIRS-....-88X2
                          </span>
                          <button className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          GROWTH
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">2 / 3</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Apr 02, 2026</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>

                    {/* License Row 3 */}
                    <tr className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            AIRS-....-22A1
                          </span>
                          <button className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          FREE
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Expiring
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">1 / 1</td>
                      <td className="px-6 py-4 text-sm text-amber-600 font-medium">Tomorrow</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Plus className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                      Activate New License
                    </span>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-indigo-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Download className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                      Download Latest Plugin
                    </span>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-indigo-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                      <HeadphonesIcon className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                      Contact Support
                    </span>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-indigo-400" />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                <button className="text-xs text-slate-500 hover:text-slate-700">Clear all</button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-medium">License Expiring Soon</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your Free license expires tomorrow.
                    </p>
                    <button className="text-xs text-indigo-600 font-medium mt-1 hover:text-indigo-700">
                      Renew Now
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">2h ago</span>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-medium">New Version Available</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      v1.3.0 is now available for download.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">1d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
