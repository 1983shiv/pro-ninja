import { HeroSection } from '@/components/marketing/hero-section';
import { DashboardMockup } from '@/components/marketing/dashboard-mockup';
import { SocialProof } from '@/components/marketing/social-proof';
import { NewsletterSection } from '@/components/blog/newsletter-section';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Dashboard Mockup */}
      <DashboardMockup />

      {/* Social Proof */}
      <SocialProof />

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}

