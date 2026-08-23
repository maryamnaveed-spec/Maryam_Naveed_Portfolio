'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BlogItem, BLOG_CATEGORIES } from '@/lib/supabase';
import BlogModal from './BlogModal';

export default function BlogSection({ blogs }: { blogs: BlogItem[] }) {
  const [active, setActive] = useState<BlogItem | null>(null);
  const [filter, setFilter] = useState('Latest');

  const options = ['Latest', 'All', ...BLOG_CATEGORIES];

  let visible = blogs;
  if (filter === 'Latest') {
    visible = [...blogs]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  } else if (filter !== 'All') {
    visible = blogs.filter((b) => b.category === filter);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-7">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`text-xs sm:text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors ${
              filter === opt
                ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white border-transparent shadow-md shadow-pink-400/25'
                : 'border-borderpink text-inksoft hover:bg-pink-50'
            }`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-inksoft italic">No blog posts in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((blog) => (
            <div
              key={blog.id}
              data-search-id={blog.id}
              onClick={() => setActive(blog)}
              className="glass-card rounded-card overflow-hidden card-shadow cursor-pointer border border-borderpink transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              {blog.cover_image_url ? (
                <div className="relative w-full aspect-[4/3] bg-pink-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-3xl">
                  ✍️
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-[11px] text-inksoft/70">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h4 className="text-lg mb-1.5">{blog.title}</h4>
                <p className="text-sm text-inksoft line-clamp-3">{blog.content}</p>
                <span className="text-xs font-semibold text-pink-600 mt-3 inline-block">
                  Read more →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <BlogModal blog={active} onClose={() => setActive(null)} />
    </div>
  );
}
