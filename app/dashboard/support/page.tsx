'use client';

import { useState } from 'react';
import { Search, Wrench, FileText, Sparkles, Eye, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  lastUpdated: string;
  status: 'open' | 'pending' | 'closed';
}

const tickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: '#2940',
    subject: 'API Connection Timeout on Bulk Review',
    lastUpdated: '2 hours ago',
    status: 'open',
  },
  {
    id: '2',
    ticketNumber: '#2891',
    subject: 'Invoice for October 2023 missing VAT',
    lastUpdated: 'Yesterday',
    status: 'pending',
  },
  {
    id: '3',
    ticketNumber: '#2805',
    subject: 'Feature Request: Custom Tone of Voice',
    lastUpdated: 'Oct 24, 2023',
    status: 'closed',
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Open
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            Pending
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative w-full bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-indigo-600/5"></div>
        <div className="relative flex flex-col items-center justify-center py-12 px-4 md:px-10 text-center">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
            How can we help?
          </h1>
          <p className="text-slate-500 text-base mb-6 max-w-2xl">
            Search our knowledge base for answers regarding plugin installation, API keys, billing, and
            troubleshooting.
          </p>
          <div className="w-full max-w-2xl relative group">
            <div className="flex w-full items-center rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-600">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                className="w-full bg-transparent border-none py-3 px-4 text-slate-900 placeholder-slate-400 focus:ring-0 text-sm focus:outline-none"
                placeholder="Search for issues, topics, or error codes..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="m-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium text-sm">
                Search
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 justify-center">
            <span>Popular:</span>
            <a className="underline hover:text-indigo-600 transition-colors" href="#">
              API Limits
            </a>
            <a className="underline hover:text-indigo-600 transition-colors" href="#">
              Invoice Download
            </a>
            <a className="underline hover:text-indigo-600 transition-colors" href="#">
              Plugin Conflict
            </a>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 flex flex-col gap-12">
          {/* Category Cards */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Browse by Category</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Technical Support Card */}
              <Link
                href="#"
                className="group flex flex-col p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-600/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wrench className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Technical Support</h3>
                <p className="text-slate-500 text-sm flex-grow">
                  Get help with plugin installation, WordPress conflicts, API errors, and configuration settings.
                </p>
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-semibold">
                  View Articles
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Billing Inquiry Card */}
              <Link
                href="#"
                className="group flex flex-col p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-600/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Billing Inquiry</h3>
                <p className="text-slate-500 text-sm flex-grow">
                  Manage your subscription plan, download invoices, update payment methods, and refunds.
                </p>
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-semibold">
                  View Articles
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Feature Request Card */}
              <Link
                href="#"
                className="group flex flex-col p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-600/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Feature Request</h3>
                <p className="text-slate-500 text-sm flex-grow">
                  Have an idea for ReviewAI? Submit feature suggestions or vote on existing roadmap items.
                </p>
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-semibold">
                  View Roadmap
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>
          </section>

          {/* Recent Tickets Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Recent Tickets</h2>
              <a className="text-indigo-600 text-sm font-medium hover:underline" href="#">
                View All Tickets
              </a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Ticket ID
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-1/2">
                        Subject
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Last Updated
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-slate-500">{ticket.ticketNumber}</td>
                        <td className="p-4 font-medium text-slate-900">{ticket.subject}</td>
                        <td className="p-4 text-slate-500">{ticket.lastUpdated}</td>
                        <td className="p-4">{getStatusBadge(ticket.status)}</td>
                        <td className="p-4 text-right">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 rounded-full px-6 py-4 font-bold transition-all hover:-translate-y-1">
          <Plus className="w-5 h-5" />
          <span>Open New Ticket</span>
        </button>
      </div>
    </div>
  );
}
