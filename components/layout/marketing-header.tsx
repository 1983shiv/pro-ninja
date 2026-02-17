'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 h-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg ai-gradient-bg flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            AI ReviewSense
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/features" 
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </Link>
          <Link 
            href="/docs" 
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Docs
          </Link>
          <Link 
            href="/blog" 
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className="text-slate-700 hover:text-slate-900">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild className="ai-gradient-bg text-white hover:shadow-lg hover:scale-[1.02] transition-all">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-900" />
          ) : (
            <Menu className="w-6 h-6 text-slate-900" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
          <nav className="flex flex-col py-4 px-4 space-y-3">
            <Link 
              href="/features" 
              className="text-[15px] font-medium text-slate-600 hover:text-slate-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-[15px] font-medium text-slate-600 hover:text-slate-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/docs" 
              className="text-[15px] font-medium text-slate-600 hover:text-slate-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link 
              href="/blog" 
              className="text-[15px] font-medium text-slate-600 hover:text-slate-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="w-full ai-gradient-bg text-white">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
