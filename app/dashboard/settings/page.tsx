'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Lock, Bell, CreditCard } from 'lucide-react';

const navigation = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Security', href: '/dashboard/settings', icon: Lock },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
];

export default function SettingsPage() {
  const pathname = usePathname();

  return (
    <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Manage your profile, security preferences, and notification settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium border-l-4 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#5b13ec]/10 text-[#5b13ec] border-[#5b13ec]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-[#5b13ec]/20' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="bg-white dark:bg-[#1e162e] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
            <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Security Settings
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              This page is under construction. Security settings will be available soon.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
