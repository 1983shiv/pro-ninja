'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

export function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 md:px-10 lg:px-40">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      <div className="absolute top-40 -left-20 h-[300px] w-[300px] rounded-full bg-purple-400/10 blur-[80px]"></div>

      <div className="layout-container flex flex-col items-center text-center max-w-4xl mx-auto relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">v2.0 Now Available</span>
        </div>

        {/* Headline */}
        <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl mb-6">
          Turn Reviews into <span className="ai-gradient-text">Revenue</span> with AI
        </h1>

        {/* Subheadline */}
        <p className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-10">
          Automate responses, analyze sentiment, and understand your customers instantly with our WordPress plugin powered by advanced LLMs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
          <Button 
            asChild 
            size="lg"
            className="ai-gradient-bg text-white text-base font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <Link href="/auth/register">
              Get Started Free
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="text-base font-bold"
          >
            <Link href="#demo" className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              View Demo
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative w-full rounded-xl border border-gray-200 bg-white p-2 shadow-2xl">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-50">
            <Image
              src="/dashboard-preview.png"
              alt="ReviewSense Dashboard Interface showing analytics and review management"
              width={1200}
              height={675}
              className="h-full w-full object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
