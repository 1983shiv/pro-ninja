interface PricingTiersHeroProps {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}

export function PricingTiersHero({ isYearly, setIsYearly }: PricingTiersHeroProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
        Choose the Right Plan for Your Business
      </h1>
      <p className="text-lg text-slate-600 mb-10">
        Start free, upgrade as you grow. All plans include core AI features to automate your customer reviews.
      </p>
      
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-slate-600 font-medium">Monthly</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
          />
          <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-slate-900 font-medium">Yearly</span>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">
            Save 20%
          </span>
        </div>
      </div>
    </div>
  );
}
