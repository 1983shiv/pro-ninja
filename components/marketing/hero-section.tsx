'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle, CheckCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32 text-center">
      {/* New Feature Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        New: GPT-4o Integration is live
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl md:text-[72px] leading-[1.1] font-bold text-slate-900 tracking-tight mb-6 max-w-5xl mx-auto">
        Automate Your Customer{' '}
        <br className="hidden lg:block" />
        Reviews with <span className="ai-gradient-text">AI</span>
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        Analyze, respond, and learn from customer feedback instantly using GPT-4, Claude, and more. Built specifically for WordPress and e-commerce.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <Button 
          asChild 
          size="lg"
          className="w-full sm:w-auto px-8 py-6 text-lg ai-gradient-bg text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all"
        >
          <Link href="/auth/register" className="flex items-center gap-2">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto px-8 py-6 text-lg bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
        >
          <Link href="#demo" className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-600 fill-indigo-100" />
            Watch Demo
          </Link>
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="text-sm text-slate-500 mb-20 flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          No credit card required
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span>25 free reviews/month</span>
      </div>
    </div>
  );
}
