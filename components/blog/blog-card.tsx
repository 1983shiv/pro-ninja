'use client';

import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor?: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  categoryColor = 'indigo',
  readTime,
  author,
  image,
}: BlogCardProps) {
  const categoryColors: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
  };

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg"
    >
      {/* Featured Image */}
      <div className="aspect-16/10 w-full overflow-hidden bg-gray-100 relative">
        <Image
          src={image}
          alt={title}
          width={600}
          height={375}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 grow">
        {/* Category & Read Time */}
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="secondary" className={categoryColors[categoryColor]}>
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-slate-900 text-xl font-bold leading-tight group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {excerpt}
        </p>

        {/* Author & Read More */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Image
              src={author.avatar}
              alt={author.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full ring-2 ring-white"
            />
            <span className="text-sm text-gray-700">{author.name}</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 text-sm font-semibold group-hover:gap-2 transition-all">
            Read More
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
