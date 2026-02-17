'use client';

import { useState } from 'react';
import { PricingTiersHero } from '@/components/pricing/pricing-tiers-hero';
import { PricingCards } from '@/components/pricing/pricing-cards';
import { TrustedBy } from '@/components/pricing/trusted-by';
import { PricingFAQ } from '@/components/pricing/pricing-faq';
import { NewsletterSection } from '@/components/blog/newsletter-section';
import { MarketingLayout } from '@/components/layout/marketing-layout';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <MarketingLayout>
      <main className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <PricingTiersHero isYearly={isYearly} setIsYearly={setIsYearly} />
        <PricingCards isYearly={isYearly} />
        <TrustedBy />
        <PricingFAQ />
        <NewsletterSection />
      </main>
    </MarketingLayout>
  );
}
