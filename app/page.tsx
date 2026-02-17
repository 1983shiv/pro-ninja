import { HeroSection } from '@/components/marketing/hero-section';
import { DashboardMockup } from '@/components/marketing/dashboard-mockup';
import { SocialProof } from '@/components/marketing/social-proof';
import { NewsletterSection } from '@/components/blog/newsletter-section';
import { MarketingLayout } from '@/components/layout/marketing-layout';

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Dashboard Mockup */}
      <DashboardMockup />

      {/* Social Proof */}
      <SocialProof />

      {/* Newsletter */}
      <NewsletterSection />
    </MarketingLayout>
  );
}

