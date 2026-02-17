'use client';

import { Brain, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function AuthLayoutSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left Side - Gradient Background with Decorations */}
      <div className="hidden lg:flex w-1/2 ai-gradient-bg relative flex-col justify-between p-8 text-white overflow-hidden">
        {/* Decorative SVG Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            <circle cx="20" cy="20" r="15" fill="white" />
            <circle cx="80" cy="80" r="20" fill="white" />
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">AI ReviewSense</span>
        </div>

        {/* Center Mockup */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-6 min-h-0">
          <div className="relative w-full max-w-sm aspect-4/3">
            {/* Background Card */}
            <div className="absolute top-3 -right-3 w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transform rotate-6"></div>
            
            {/* Main Card */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl p-4 flex flex-col justify-between transform -rotate-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-2.5 w-1/3 bg-white/40 rounded-full"></div>
                <div className="h-7 w-7 bg-white/40 rounded-full"></div>
              </div>

              {/* Content Skeleton */}
              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/30 rounded-full"></div>
                <div className="h-1.5 w-5/6 bg-white/30 rounded-full"></div>
                <div className="h-1.5 w-4/6 bg-white/30 rounded-full"></div>
              </div>

              {/* Stats Cards */}
              <div className="mt-6 flex gap-3">
                <div className="flex-1 h-16 bg-white/30 rounded-lg"></div>
                <div className="flex-1 h-16 bg-white/30 rounded-lg"></div>
              </div>

              {/* Floating Sentiment Badge */}
              <div className="absolute -right-4 top-8 bg-emerald-400 text-emerald-900 px-3 py-1.5 rounded-lg font-semibold shadow-lg text-xs flex items-center gap-1.5">
                <span className="text-lg">✨</span>
                Sentiment: Positive
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 max-w-lg shrink-0">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            ))}
          </div>
          <blockquote className="text-xl font-medium leading-relaxed mb-4">
            "AI ReviewSense saved us over 10 hours a week on customer support. The automated sentiment analysis is uncannily accurate."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/10 overflow-hidden">
              <Image
                src="/avatar/sarah-jenkins.png"
                alt="Sarah Jenkins"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-bold text-base">Sarah Jenkins</div>
              <div className="text-indigo-100 text-sm">CTO at TechFlow Agency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-8 overflow-y-auto bg-white">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-md ai-gradient-bg flex items-center justify-center">
              <Brain className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">AI ReviewSense</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
