'use client';

import { BlogCard } from './blog-card';

// Sample blog data - replace with API call later
const blogPosts = [
  {
    slug: 'multi-model-routing-explained',
    title: 'Multi-Model AI Routing: Choosing the Right Brain for the Job',
    excerpt: 'Learn how ReviewSense intelligently routes requests between GPT-4o, Claude, and Gemini based on context, tone, and complexity.',
    category: 'AI Tips',
    categoryColor: 'purple',
    readTime: '8 min read',
    author: {
      name: 'Sarah Kim',
      avatar: '/avatars/sarah-kim.jpg',
    },
    image: '/blog/multi-model-routing.jpg',
  },
  {
    slug: 'wordpress-plugin-setup-guide',
    title: 'Setting Up the ReviewSense WordPress Plugin in 5 Minutes',
    excerpt: 'Step-by-step walkthrough from installation to your first auto-generated reply. Screenshots included for every step.',
    category: 'Tutorial',
    categoryColor: 'blue',
    readTime: '5 min read',
    author: {
      name: 'Mike Torres',
      avatar: '/avatars/mike-torres.jpg',
    },
    image: '/blog/wordpress-setup.jpg',
  },
  {
    slug: 'case-study-ecommerce-growth',
    title: 'How an E-commerce Store Boosted Trust Score by 47% in 60 Days',
    excerpt: 'Real data from a Shopify merchant using ReviewSense to respond to 1,200+ reviews with 98% customer satisfaction.',
    category: 'Case Study',
    categoryColor: 'emerald',
    readTime: '10 min read',
    author: {
      name: 'Emma Watson',
      avatar: '/avatars/emma-watson.jpg',
    },
    image: '/blog/case-study-ecommerce.jpg',
  },
  {
    slug: 'sentiment-analysis-deep-dive',
    title: 'Behind the Scenes: How Our Sentiment Engine Works',
    excerpt: 'A technical deep-dive into transformer models, emotion detection algorithms, and why we chose this architecture.',
    category: 'Dev Log',
    categoryColor: 'amber',
    readTime: '12 min read',
    author: {
      name: 'Alex Chen',
      avatar: '/avatars/alex-chen.jpg',
    },
    image: '/blog/sentiment-deep-dive.jpg',
  },
  {
    slug: 'gpt4o-vs-claude-comparison',
    title: 'GPT-4o vs Claude 3.5 for Customer Support: Performance Comparison',
    excerpt: 'We tested both models on 500+ real reviews. Here is which one wins for empathy, accuracy, and speed.',
    category: 'AI Tips',
    categoryColor: 'purple',
    readTime: '7 min read',
    author: {
      name: 'Sarah Kim',
      avatar: '/avatars/sarah-kim.jpg',
    },
    image: '/blog/gpt-vs-claude.jpg',
  },
  {
    slug: 'community-feature-requests',
    title: 'You Spoke, We Listened: Q1 2025 Community Feature Roadmap',
    excerpt: 'The top 10 requested features from our users and when you can expect them. Plus, peek at our internal roadmap.',
    category: 'Community',
    categoryColor: 'rose',
    readTime: '6 min read',
    author: {
      name: 'Mike Torres',
      avatar: '/avatars/mike-torres.jpg',
    },
    image: '/blog/community-roadmap.jpg',
  },
];

export function BlogGrid() {
  return (
    <section className="py-16 px-4 md:px-10 lg:px-40 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
