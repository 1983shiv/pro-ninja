'use client';

import { Diamond, Rocket, Layers, Zap, Globe } from 'lucide-react';

const companies = [
  { name: 'GemTech', icon: Diamond },
  { name: 'RocketScale', icon: Rocket },
  { name: 'StackFlow', icon: Layers },
  { name: 'SwiftCart', icon: Zap },
  { name: 'GlobalNet', icon: Globe },
];

export function SocialProof() {
  return (
    <div className="my-24 border-t border-slate-200 pt-16">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8 text-center">
        Trusted by 500+ WordPress Businesses
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
        {companies.map((company) => (
          <div 
            key={company.name}
            className="flex items-center gap-2 text-slate-800 font-bold text-xl grayscale hover:grayscale-0 transition-all duration-300 cursor-default"
          >
            <company.icon className="w-6 h-6" />
            {company.name}
          </div>
        ))}
      </div>
    </div>
  );
}
