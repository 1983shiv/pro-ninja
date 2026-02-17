import Link from 'next/link';
import { ArrowLeft, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingLayout } from '@/components/layout/marketing-layout';
import Image from 'next/image';

export default function NotFound() {
  return (
    <MarketingLayout>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden min-h-[80vh]">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-[#4913ec]/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-3xl w-full flex flex-col items-center text-center gap-8 z-10">
          {/* 3D Illustration */}
          <div className="relative w-full max-w-[400px] aspect-square md:aspect-4/3 flex items-center justify-center mb-2">
            <div className="w-full h-full bg-linear-to-b from-transparent to-[#4913ec]/5 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                {/* Placeholder for 3D robot illustration */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 bg-linear-to-br from-[#4913ec]/20 to-purple-500/20 rounded-full blur-2xl" />
                  <div className="relative text-[#4913ec] opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                      <circle cx="100" cy="80" r="40" fill="currentColor" opacity="0.2" />
                      <rect x="70" y="110" width="60" height="70" rx="8" fill="currentColor" opacity="0.3" />
                      <circle cx="85" cy="70" r="8" fill="currentColor" />
                      <circle cx="115" cy="70" r="8" fill="currentColor" />
                      <path d="M85 90 Q100 100 115 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-4 max-w-lg mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#110d1b] tracking-tight">
              <span className="text-[#4913ec]">404</span> - Page Not Found
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-normal leading-relaxed">
              It seems the AI couldn't find what you were looking for. Let's get you back on track.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
            <Button 
              asChild 
              className="group relative flex items-center justify-center gap-2 bg-[#4913ec] hover:bg-[#3b0fc2] text-white h-12 px-8 rounded-lg text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#4913ec]/20 hover:shadow-[#4913ec]/30 min-w-40"
            >
              <Link href="/">
                <ArrowLeft className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
                <span>Go Back Home</span>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#4913ec]/30 hover:bg-slate-50 text-slate-700 hover:text-[#4913ec] h-12 px-8 rounded-lg text-sm font-bold tracking-wide transition-all min-w-40"
            >
              <Link href="/contact">
                <Headphones className="w-[18px] h-[18px]" />
                <span>Contact Support</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </MarketingLayout>
  )  
}  
