import { Check, X } from 'lucide-react';
import Link from 'next/link';

interface PricingCardsProps {
  isYearly: boolean;
}

export function PricingCards({ isYearly }: PricingCardsProps) {
  // Calculate prices based on billing period
  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return isYearly ? Math.floor(monthlyPrice * 12 * 0.8) : monthlyPrice;
  };

  const getPeriod = () => isYearly ? '/year' : '/month';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {/* FREE Plan */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-900">FREE</h3>
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Testing
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-slate-900">${getPrice(0)}</span>
            <span className="text-slate-500 font-medium">{getPeriod()}</span>
          </div>
          <p className="text-sm text-slate-600">
            Try AI ReviewSense with basic features for personal projects.
          </p>
        </div>
        
        <Link
          href="/auth/register"
          className="block w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-medium rounded-lg text-center hover:bg-slate-50 hover:border-slate-300 transition-all mb-8"
        >
          Get Started
        </Link>
        
        <div className="space-y-4 grow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Features</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              25 reviews/month
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              GPT-4o-mini only
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Manual analysis
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              1 website
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-400 line-through">
              <X className="w-5 h-5 text-slate-300 shrink-0" />
              Auto-reply
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-400 line-through">
              <X className="w-5 h-5 text-slate-300 shrink-0" />
              Bulk operations
            </li>
          </ul>
        </div>
      </div>

      {/* STARTER Plan - Most Popular */}
      <div className="bg-white rounded-2xl border-2 border-indigo-500 p-8 flex flex-col h-full relative shadow-xl scale-[1.02] z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
          Most Popular
        </div>
        
        <div className="mb-6 pt-2">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-indigo-600">STARTER</h3>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-5xl font-bold text-slate-900">${getPrice(19)}</span>
            <span className="text-slate-500 font-medium">{getPeriod()}</span>
          </div>
          <p className="text-sm text-slate-600">
            Perfect for growing businesses needing automation.
          </p>
        </div>
        
        <Link
          href="/auth/register"
          className="block w-full py-3 px-4 ai-gradient-bg text-white font-medium rounded-lg text-center shadow-md hover:shadow-lg hover:opacity-95 transition-all mb-4"
        >
          Start Free Trial
        </Link>
        <p className="text-xs text-center text-slate-500 mb-8">14-day free trial, cancel anytime</p>
        
        <div className="space-y-4 grow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Everything in Free, plus:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
              <Check className="w-5 h-5 text-emerald-500 shrink-0 fill-emerald-500" />
              500 reviews/month
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              All 9 AI providers
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Auto-analysis & Reply
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Priority email support
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              1 website license
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-400 line-through">
              <X className="w-5 h-5 text-slate-300 shrink-0" />
              Bulk operations
            </li>
          </ul>
        </div>
      </div>

      {/* GROWTH Plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-900">GROWTH</h3>
            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Best Value
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-slate-900">${getPrice(49)}</span>
            <span className="text-slate-500 font-medium">{getPeriod()}</span>
          </div>
          <p className="text-sm text-slate-600">
            For established businesses with high volume needs.
          </p>
        </div>
        
        <Link
          href="/auth/register"
          className="block w-full py-3 px-4 bg-indigo-50 text-indigo-700 font-medium rounded-lg text-center hover:bg-indigo-100 transition-all mb-8"
        >
          Start Free Trial
        </Link>
        
        <div className="space-y-4 grow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Everything in Starter, plus:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              2,500 reviews/month
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Bulk operations
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Advanced analytics
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Multi-source support
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              3 website licenses
            </li>
          </ul>
        </div>
      </div>

      {/* AGENCY Plan */}
      <div className="rounded-2xl border border-indigo-200 bg-linear-to-br from-white to-indigo-50 p-8 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-indigo-900">AGENCY</h3>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              For Teams
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-slate-900">${getPrice(149)}</span>
            <span className="text-slate-500 font-medium">{getPeriod()}</span>
          </div>
          <p className="text-sm text-slate-600">
            Scale your agency with unlimited potential.
          </p>
        </div>
        
        <Link
          href="/contact"
          className="block w-full py-3 px-4 bg-white border border-slate-200 text-slate-900 font-medium rounded-lg text-center hover:bg-slate-50 transition-all mb-8 shadow-sm"
        >
          Contact Sales
        </Link>
        
        <div className="space-y-4 grow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Everything in Growth, plus:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Unlimited reviews
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              White label options
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Unlimited sites
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Dedicated account manager
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              Custom API Access
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
