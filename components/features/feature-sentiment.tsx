'use client';

import { BarChart3, TrendingUp, Brain } from 'lucide-react';
import Image from 'next/image';

export function FeatureSentiment() {
  return (
    <section className="py-20 lg:py-32 px-4 md:px-10 lg:px-40 bg-slate-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Text Side (Order 2 on mobile, 1 on desktop) */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-2">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 text-3xl md:text-4xl font-bold leading-tight">
            Sentiment Analysis Dashboard
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Go beyond star ratings. Visualize customer emotions over time to spot trends and fix product issues before they escalate. Our deep learning models categorize feedback into actionable insights, highlighting key pain points and delights.
          </p>

          {/* Mini Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-indigo-600 mb-2">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900">Trend Spotting</h3>
              <p className="text-sm text-gray-500 mt-1">Identify rising issues in real-time.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-indigo-600 mb-2">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900">Emotion Detection</h3>
              <p className="text-sm text-gray-500 mt-1">Track frustration vs. satisfaction.</p>
            </div>
          </div>
        </div>

        {/* Image Side (Order 1 on mobile, 2 on desktop) */}
        <div className="relative group order-1 lg:order-2">
          <div className="absolute -inset-4 rounded-xl bg-linear-to-l from-indigo-500/20 to-blue-200/20 opacity-50 blur-lg transition duration-500 group-hover:opacity-100"></div>
          <div className="relative rounded-2xl bg-white p-4 ring-1 ring-gray-900/5 shadow-xl">
            <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-white relative flex items-center justify-center">
              <Image
                src="/features-sentiment-analysis.png"
                alt="Sentiment Analysis Graphs and Charts"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
