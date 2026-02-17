'use client';

import { CreditCard, Infinity, Brain, Headphones, Plus, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
}

const invoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2023-001', date: 'Oct 01, 2023', amount: '$29.00', status: 'paid' },
  { id: '2', invoiceNumber: 'INV-2023-002', date: 'Sep 01, 2023', amount: '$29.00', status: 'paid' },
  { id: '3', invoiceNumber: 'INV-2023-003', date: 'Aug 01, 2023', amount: '$29.00', status: 'paid' },
  { id: '4', invoiceNumber: 'INV-2023-004', date: 'Jul 01, 2023', amount: '$29.00', status: 'pending' },
];

export default function BillingPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        {/* Page Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Billing &amp; Invoices</h1>
          <p className="text-slate-500">Manage your subscription plan, payment methods, and download invoices.</p>
        </div>

        {/* Current Plan Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">Current Plan: Pro</h2>
                <span className="bg-indigo-600/10 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="text-slate-500 max-w-lg">
                You are currently on the <span className="font-semibold text-slate-900">Pro plan</span> ($29/mo).
                Your next billing date is <span className="font-semibold text-slate-900">November 1, 2023</span>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 h-10 rounded-lg text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel Subscription
              </button>
              <Button className="px-5 h-10 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/30">
                Upgrade Plan
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Infinity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Unlimited Reviews</h3>
                <p className="text-xs text-slate-500 mt-1">Generate unlimited reviews</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">AI Analysis</h3>
                <p className="text-xs text-slate-500 mt-1">Advanced sentiment analysis</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Priority Support</h3>
                <p className="text-xs text-slate-500 mt-1">24/7 dedicated support</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <section className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900">Payment Methods</h3>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-16 rounded border border-slate-200 bg-white flex items-center justify-center p-1">
                    <svg className="h-full w-full" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="32" rx="4" fill="white"/>
                      <path d="M18 16.5L15 19.5L14 18.5" stroke="#1434CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="22" y="12" width="20" height="2" rx="1" fill="#1434CB"/>
                      <rect x="22" y="16" width="16" height="2" rx="1" fill="#1434CB"/>
                      <rect x="22" y="20" width="12" height="2" rx="1" fill="#1434CB"/>
                      <text x="32" y="30" fontSize="8" fill="#1434CB" fontWeight="bold">VISA</text>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-900 font-medium flex items-center gap-2">
                      Visa ending in 4242
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Default
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">Expires 12/2025</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                  Edit
                </button>
              </div>
              <hr className="border-slate-200 my-4" />
              <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                <Plus className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>
          </section>

          {/* Billing Address */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900">Billing Address</h3>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between h-full">
              <div className="text-sm text-slate-900 space-y-1">
                <p className="font-semibold">Acme Inc.</p>
                <p className="text-slate-500">123 Innovation Dr.</p>
                <p className="text-slate-500">San Francisco, CA 94103</p>
                <p className="text-slate-500">United States</p>
              </div>
              <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors text-left mt-4">
                Update Address
              </button>
            </div>
          </section>
        </div>

        {/* Invoices Table */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Invoices</h3>
            <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-900">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-medium">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 text-slate-500">{invoice.date}</td>
                      <td className="px-6 py-4 font-medium">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        {invoice.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 border border-yellow-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-slate-500 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-indigo-600/5"
                          title="Download PDF"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-medium">4</span> of <span className="font-medium">24</span> invoices
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 pb-6">
          © 2023 WP AI Reviewer. All rights reserved.{' '}
          <a className="hover:text-indigo-600 hover:underline" href="#">
            Privacy Policy
          </a>{' '}
          •{' '}
          <a className="hover:text-indigo-600 hover:underline" href="#">
            Terms of Service
          </a>
        </footer>
      </div>
    </div>
  );
}
