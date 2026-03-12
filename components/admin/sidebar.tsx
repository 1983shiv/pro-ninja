'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  Users,
  Key,
  Package,
  Download,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';

const navigation = [
  { name: 'Overview',      href: '/admin',              icon: LayoutDashboard, exact: true },
  { name: 'Users',         href: '/admin/users',        icon: Users },
  { name: 'Licenses',      href: '/admin/licenses',     icon: Key },
  { name: 'Products',      href: '/admin/products',     icon: Package },
  { name: 'Downloads',     href: '/admin/downloads',    icon: Download },
  { name: 'Support',       href: '/admin/support',      icon: MessageSquare },
  { name: 'Audit Logs',    href: '/admin/audit',        icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(item: { href: string; exact?: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-slate-700/60">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight block leading-tight">
              AI ReviewSense
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-0.5 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin badge at bottom */}
      <div className="p-4 border-t border-slate-700/60">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800/60">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-medium text-slate-400">Admin access</span>
        </div>
      </div>
    </aside>
  );
}
