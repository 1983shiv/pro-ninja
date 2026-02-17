'use client';

import { Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function FeatureMultiModel() {
  return (
    <section className="py-20 lg:py-32 px-4 md:px-10 lg:px-40 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Image Side */}
        <div className="relative group">
          <div className="absolute -inset-4 rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 opacity-50 blur-lg transition duration-500 group-hover:opacity-100"></div>
          <div className="relative rounded-2xl bg-gray-900 p-6 ring-1 ring-gray-900/5 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="ml-auto text-xs text-gray-400 font-mono">Settings.json</div>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center gap-3">
                <span className="text-purple-400">"model_selection":</span>
                <span className="text-emerald-400">"gpt-4o"</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">"fallback_model":</span>
                <span className="text-emerald-400">"claude-3-5-sonnet"</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">"temperature":</span>
                <span className="text-blue-400">0.7</span>
              </div>
              <div className="pl-4 border-l-2 border-gray-700 mt-4">
                <p className="text-gray-400">// Selecting the best brain for the job...</p>
                <p className="text-gray-300">
                  <span className="text-blue-400">const</span> response = <span className="text-yellow-400">await</span> ai.generate();
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Text Side */}
        <div className="flex flex-col gap-6">
          <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-2">
            <Network className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 text-3xl md:text-4xl font-bold leading-tight">
            Powered by Top LLMs
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Choose your brain. Seamlessly switch between GPT-4o for complex reasoning or Claude 3.5 Sonnet for natural, human-like tone. We integrate with the best so you always have the smartest response engine.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              OpenAI GPT-4o
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Claude 3.5 Sonnet
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              Google Gemini Pro
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
