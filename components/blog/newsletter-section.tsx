'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-20 px-4 md:px-10 lg:px-40 bg-linear-to-br from-[#120d1b] to-[#1e1433] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px]"></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-6">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Heading */}
        <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          Stay ahead of the AI curve
        </h2>

        {/* Description */}
        <p className="text-purple-200 text-lg mb-8 max-w-xl mx-auto">
          Weekly insights, tutorials, and product updates delivered to your inbox. No spam, just the good stuff.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/60 focus:border-indigo-400 grow"
          />
          <Button
            type="submit"
            className="ai-gradient-bg text-white font-bold shadow-lg hover:shadow-xl whitespace-nowrap shrink-0"
          >
            Subscribe
          </Button>
        </form>

        {/* Trust Badge */}
        <p className="text-purple-300/70 text-sm mt-4">
          Join 12,000+ subscribers. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
