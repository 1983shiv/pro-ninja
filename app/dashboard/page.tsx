import { redirect } from 'next/navigation';
import { Key, Star, Gauge, Calendar, TrendingUp, ArrowRight, Plus, Download, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import { currentUser } from '@/lib/auth';
import { getLicensesCollection, getProductsCollection, getNotificationsCollection } from '@/drizzle/db';


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

const TIER_COLORS: Record<string, string> = {
  FREE:    'bg-slate-100 text-slate-600 border-slate-200',
  STARTER: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  GROWTH:  'bg-purple-50 text-purple-700 border-purple-100',
  AGENCY:  'bg-amber-50 text-amber-700 border-amber-100',
};

function formatDate(d: Date | string | null): string {
  if (!d) return 'Lifetime';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user?.id) redirect('/login');

  const [licensesCol, productsCol, notificationsCol] = await Promise.all([
    getLicensesCollection(),
    getProductsCollection(),
    getNotificationsCollection(),
  ]);

  const [rawLicenses, rawNotifications] = await Promise.all([
    licensesCol.find({ userId: user.id }).sort({ createdAt: -1 }).toArray(),
    notificationsCol
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
  ]);

  // Attach product info to each license
  const licenses = await Promise.all(
    rawLicenses.map(async (lic) => {
      const product = await productsCol.findOne({ _id: lic.productId });
      return {
        id: String(lic._id),
        licenseKey: lic.licenseKey,
        status: lic.status as string,
        plan: product?.name ?? 'Free',
        tierType: (product?.tierType ?? 'FREE') as string,
        activations: lic.activations,
        maxActivations: lic.maxActivations,
        reviewsUsed: lic.reviewsUsed,
        reviewLimit: lic.reviewLimit,
        expiresAt: lic.expiresAt ?? null,
        createdAt: lic.createdAt,
      };
    })
  );

  // Derived stats
  const activeLicenses = licenses.filter((l) => l.status === 'active');
  const primaryLicense = activeLicenses[0] ?? licenses[0] ?? null;
  const totalReviewsUsed = primaryLicense?.reviewsUsed ?? 0;
  const reviewLimit = primaryLicense?.reviewLimit ?? 0;
  const reviewsRemaining = Math.max(0, reviewLimit - totalReviewsUsed);
  const usagePct = reviewLimit > 0 ? Math.min(100, Math.round((totalReviewsUsed / reviewLimit) * 100)) : 0;

  // Soonest expiry across active licenses
  const soonestExpiry = activeLicenses
    .map((l) => l.expiresAt)
    .filter((d): d is Date => d instanceof Date)
    .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

  // Recent 3 licenses for the table
  const recentLicenses = licenses.slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user.name ?? user.email} — here&apos;s what&apos;s happening with your licenses.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Licenses"
            value={activeLicenses.length}
            icon={<Key className="w-5 h-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
            badge={
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                {activeLicenses.length > 0 ? 'Active' : 'None'}
              </span>
            }
          />
          <StatCard
            title="Reviews Used"
            value={
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{totalReviewsUsed}</span>
                <span className="text-sm text-slate-400 font-medium">/ {reviewLimit > 0 ? reviewLimit : '∞'}</span>
              </div>
            }
            icon={<Star className="w-5 h-5 text-indigo-600" />}
            iconBg="bg-indigo-50"
            badge={<span className="text-xs font-medium text-slate-500">Monthly Cap</span>}
            progress={usagePct}
          />
          <StatCard
            title="Quota Remaining"
            value={reviewLimit > 0 ? reviewsRemaining : '∞'}
            subtitle={reviewLimit > 0 ? `${100 - usagePct}% left this period` : 'Unlimited reviews'}
            icon={<Gauge className="w-5 h-5 text-amber-600" />}
            iconBg="bg-amber-50"
            badge={
              usagePct >= 80 ? (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                  Low Quota
                </span>
              ) : undefined
            }
          />
          <StatCard
            title="License Expiry"
            value={soonestExpiry ? formatDate(soonestExpiry) : 'Lifetime'}
            subtitle={primaryLicense?.plan ?? 'No active license'}
            icon={<Calendar className="w-5 h-5 text-slate-600" />}
            iconBg="bg-slate-100"
            badge={
              <Link href="/dashboard/licenses" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
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
                {recentLicenses.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">No licenses found.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                        <th className="px-6 py-4 font-semibold">Key</th>
                        <th className="px-6 py-4 font-semibold">Plan</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Usage</th>
                        <th className="px-6 py-4 font-semibold">Expires</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLicenses.map((lic) => {
                        const maskedKey =
                          lic.licenseKey.length > 8
                            ? `${lic.licenseKey.slice(0, 4)}-....-${lic.licenseKey.slice(-4)}`
                            : lic.licenseKey;
                        const pct =
                          lic.reviewLimit > 0
                            ? Math.min(100, Math.round((lic.reviewsUsed / lic.reviewLimit) * 100))
                            : 0;
                        const tierColor =
                          TIER_COLORS[lic.tierType] ?? TIER_COLORS['FREE'];

                        return (
                          <tr key={lic.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                {maskedKey}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tierColor}`}>
                                {lic.tierType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {lic.status === 'active' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Active
                                </span>
                              ) : lic.status === 'expired' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  Expired
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                  {lic.status.charAt(0).toUpperCase() + lic.status.slice(1)}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1 min-w-[110px]">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{lic.reviewsUsed} used</span>
                                  <span>{lic.reviewLimit > 0 ? lic.reviewLimit : '∞'}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${pct >= 80 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {formatDate(lic.expiresAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/dashboard/licenses" className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Plus className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                      View My Licenses
                    </span>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-indigo-400" />
                </Link>

                <Link href="/dashboard/downloads" className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Download className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                      Download Latest Plugin
                    </span>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-indigo-400" />
                </Link>

                <Link href="/dashboard/support" className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                      <HeadphonesIcon className="w-[18px] h-[18px]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">
                      Contact Support
                    </span>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] text-slate-300 group-hover:text-indigo-400" />
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                {rawNotifications.length > 0 && (
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {rawNotifications.filter((n) => !n.isRead).length} new
                  </span>
                )}
              </div>
              {rawNotifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No notifications yet.</p>
              ) : (
                <div className="space-y-4">
                  {rawNotifications.map((n) => {
                    const dotColor =
                      n.type === 'warning' ? 'bg-amber-500'
                      : n.type === 'error' ? 'bg-red-500'
                      : n.type === 'success' ? 'bg-emerald-500'
                      : 'bg-blue-500';
                    const age = Math.round(
                      (Date.now() - new Date(n.createdAt).getTime()) / 3600000
                    );
                    const ageLabel = age < 24 ? `${age}h ago` : `${Math.floor(age / 24)}d ago`;

                    return (
                      <div key={String(n._id)} className="flex gap-3 items-start">
                        <div className={`w-2 h-2 rounded-full ${dotColor} mt-2 shrink-0`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${n.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                          {n.link && (
                            <Link href={n.link} className="text-xs text-indigo-600 font-medium mt-1 hover:text-indigo-700">
                              View →
                            </Link>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{ageLabel}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
