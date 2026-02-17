import { BlogHero } from '@/components/blog/blog-hero';
import { BlogFilters } from '@/components/blog/blog-filters';
import { BlogGrid } from '@/components/blog/blog-grid';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { NewsletterSection } from '@/components/blog/newsletter-section';

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <BlogHero />
      <BlogFilters />
      <BlogGrid />
      <BlogPagination />
      <NewsletterSection />
    </main>
  );
}
