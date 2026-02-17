'use client';

import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export function BlogHero() {
  return (
    <section className="py-20 px-4 md:px-10 lg:px-40 bg-slate-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 items-center">
        {/* Image Side - 3/5 width */}
        <div className="lg:col-span-3 relative group">
          <div className="absolute -inset-4 rounded-xl bg-linear-to-r from-indigo-500/20 to-purple-200/20 opacity-50 blur-lg transition duration-500 group-hover:opacity-100"></div>
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-gray-900/5 shadow-2xl">
            <div className="aspect-16/10 w-full overflow-hidden bg-gray-100">
              <Image
                src="/blog/featured-post.jpg"
                alt="ReviewSense 2.0 release announcement"
                width={1200}
                height={750}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Content Side - 2/5 width */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 self-start">
            Product Update
          </Badge>
          <h1 className="text-slate-900 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Introducing ReviewSense 2.0
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            The biggest update yet. Real-time analytics, multi-model AI routing, and 10x faster response times. Here's everything new in v2.0.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Image
                src="/avatars/alex-chen.jpg"
                alt="Alex Chen"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full ring-2 ring-white"
              />
              <span>Alex Chen</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>6 min read</span>
            </div>
          </div>
          <Button className="ai-gradient-bg text-white shadow-lg self-start group">
            Read Full Story
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
