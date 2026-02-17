'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function BlogPagination() {
  return (
    <section className="py-12 px-4 md:px-10 lg:px-40 bg-slate-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        
        <span className="px-2 text-gray-400">...</span>
        
        <Button variant="outline">8</Button>
        
        <Button variant="outline" size="icon">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}
