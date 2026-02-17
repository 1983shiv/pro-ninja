'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PricingCTA() {
  return (
    <section className="py-20 px-4 md:px-10 lg:px-40 bg-slate-50">
      <div className="max-w-5xl mx-auto rounded-3xl ai-gradient-bg px-6 py-16 md:px-12 md:py-20 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Ready to automate your reputation?
          </h2>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl">
            Join 5,000+ businesses using ReviewSense to turn customer feedback into their biggest growth engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-50 text-base font-bold shadow-lg w-full sm:w-auto"
            >
              <Link href="/auth/register">Start Free Trial</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 text-base font-bold w-full sm:w-auto"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
