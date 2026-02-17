'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, Key, Download, User, CreditCard, HelpCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Licenses', href: '/dashboard/licenses', icon: Key },
  { name: 'Downloads', href: '/dashboard/downloads', icon: Download },
  { name: 'Account', href: '/dashboard/profile', icon: User },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            AI ReviewSense
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-4 transition-colors ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]'
                  : 'text-slate-600 border-transparent hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Usage Section */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="mb-3 flex justify-between items-center text-xs font-medium text-slate-600">
          <span>Usage</span>
          <span>450 / 500</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '90%' }} />
        </div>
        <Button
          className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          variant="outline"
        >
          <Zap className="w-[18px] h-[18px]" />
          Upgrade Plan
        </Button>
      </div>
    </aside>
  );
}
