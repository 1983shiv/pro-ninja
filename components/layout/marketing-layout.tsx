import { ReactNode } from 'react';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-white to-slate-50">
      <MarketingHeader />
      <main className="grow pt-[72px] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/50 to-slate-50 pointer-events-none z-0"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
