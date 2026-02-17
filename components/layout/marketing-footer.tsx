import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="w-full py-8 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} AI ReviewSense. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          <Link 
            href="/legal" 
            className="text-slate-500 hover:text-[#4913ec] text-sm font-medium transition-colors"
          >
            Legal
          </Link>
          <Link 
            href="/privacy" 
            className="text-slate-500 hover:text-[#4913ec] text-sm font-medium transition-colors"
          >
            Privacy
          </Link>
          <Link 
            href="/terms" 
            className="text-slate-500 hover:text-[#4913ec] text-sm font-medium transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
