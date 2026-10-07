'use client';

import { StoryItem } from '@/lib/supabase';
import StoryGrid from './StoryGrid';

export default function StoriesPageView({ stories }: { stories: StoryItem[] }) {
  return <StoryGrid stories={stories} />;
}
