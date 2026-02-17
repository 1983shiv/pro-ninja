'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Posts', active: true },
  { id: 'product', label: 'Product Updates', active: false },
  { id: 'ai', label: 'AI Tips', active: false },
  { id: 'tutorials', label: 'Tutorials', active: false },
  { id: 'case-studies', label: 'Case Studies', active: false },
];

export function BlogFilters() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="py-12 px-4 md:px-10 lg:px-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? 'default' : 'ghost'}
                className={
                  activeFilter === category.id
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
                onClick={() => setActiveFilter(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
