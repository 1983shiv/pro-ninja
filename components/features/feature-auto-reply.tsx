'use client';

import { Bot, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export function FeatureAutoReply() {
  return (
    <section className="py-20 lg:py-32 px-4 md:px-10 lg:px-40 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Image Side */}
        <div className="relative group">
          <div className="absolute -inset-4 rounded-xl bg-linear-to-r from-indigo-500/20 to-purple-200/20 opacity-50 blur-lg transition duration-500 group-hover:opacity-100"></div>
          <div className="relative rounded-2xl bg-white p-4 ring-1 ring-gray-900/5 shadow-xl">
            <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-100 relative">
              <Image
                src="/features-auto-reply.png"
                alt="AI Auto-Reply Interface showing drafted responses"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
              
              {/* Floating UI Element Decoration */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg border border-gray-100 animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Side */}
        <div className="flex flex-col gap-6">
          <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-2">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 text-3xl md:text-4xl font-bold leading-tight">
            Instant AI Auto-Reply
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Never leave a customer waiting. Our AI drafts context-aware responses to 5-star praise and 1-star complaints alike, ready for your approval. It understands nuance, detects sarcasm, and maintains your brand voice consistently.
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>Context-aware response generation</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>One-click approval workflow</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>Customizable tone presets</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
