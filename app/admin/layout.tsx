'use client';

import {
  Bell,
  LogOut,
  ChevronDown,
  Brain,
  Users,
  Key,
  Package,
  Download,
  MessageSquare,
  ClipboardList,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auth + role guard (middleware handles server-side; this catches client transitions)
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') router.push('/dashboard');
  }, [status, session, router]);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const handleLogout = () => signOut({ callbackUrl: '/' });

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent" />
          <p className="mt-4 text-sm text-slate-400">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">

          {/* Mobile logo (sidebar hidden on small screens) */}
          <div className="flex items-center md:hidden">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">Admin</span>
            </Link>
          </div>

          {/* Desktop: admin badge */}
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Admin Panel</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-slate-200" />

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600 text-white text-sm font-bold">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Admin'}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{session.user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700">{session.user?.name || 'Admin'}</p>
                  <p className="text-xs text-indigo-600 font-semibold">Administrator</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{session.user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  </div>

                  {/* Navigation — all admin pages */}
                  <div className="py-1 border-b border-slate-100">
                    <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">navigate</p>
                    {[
                      { href: '/admin',           icon: LayoutDashboard, label: 'Overview' },
                      { href: '/admin/users',      icon: Users,           label: 'Users' },
                      { href: '/admin/licenses',   icon: Key,             label: 'Licenses' },
                      { href: '/admin/products',   icon: Package,         label: 'Products' },
                      { href: '/admin/downloads',  icon: Download,        label: 'Downloads' },
                      { href: '/admin/support',    icon: MessageSquare,   label: 'Support' },
                      { href: '/admin/audit',      icon: ClipboardList,   label: 'Audit Logs' },
                    ].map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        {children}
      </main>
    </div>
  );
}
