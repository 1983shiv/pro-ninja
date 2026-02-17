import { PricingHero } from '@/components/features/pricing-hero';
import { FeatureAutoReply } from '@/components/features/feature-auto-reply';
import { FeatureSentiment } from '@/components/features/feature-sentiment';
import { FeatureMultiModel } from '@/components/features/feature-multi-model';
import { PricingCTA } from '@/components/features/pricing-cta';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <PricingHero />
      <FeatureAutoReply />
      <FeatureSentiment />
      <FeatureMultiModel />
      <PricingCTA />
    </main>
  );
}
