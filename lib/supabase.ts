import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ArtItem = {
  id: string;
  title: string;
  category: 'art' | 'calligraphy';
  subcategory: string;
  description: string | null;
  image_url: string;
  before_after_gif_url: string | null;
  created_at: string;
};

export type BookItem = {
  id: string;
  title: string;
  author: string | null;
  language: 'Urdu' | 'English';
  cover_image_url: string | null;
  pdf_url: string;
  review: string | null;
  rating: number;
  created_at: string;
};

export type MessageItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type BlogItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_image_url: string | null;
  created_at: string;
};

export type CommentItem = {
  id: string;
  item_type: 'art' | 'book';
  item_id: string;
  item_title: string | null;
  name: string;
  comment: string;
  is_read: boolean;
  created_at: string;
};

export type SettingsItem = {
  id: number;
  comments_enabled: boolean;
  quote_of_day: string;
  background_image_url: string | null;
  profile_image_url: string | null;
  resume_url: string | null;
};

export type ResumeRequestStatus = 'pending' | 'approved' | 'rejected' | 'downloaded';

export type ResumeRequestItem = {
  id: string;
  name: string;
  reason: string;
  status: ResumeRequestStatus;
  created_at: string;
};

export type ChatMessageItem = {
  id: string;
  visitor_id: string;
  name: string;
  sender: 'user' | 'admin';
  message: string;
  is_read: boolean;
  created_at: string;
};

export type AudioBookItem = {
  id: string;
  title: string;
  author: string | null;
  cover_image_url: string;
  audio_url: string;
  created_at: string;
};

export type StoryItem = {
  id: string;
  title: string;
  author: string | null;
  category: string;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string;
  video_url: string | null;
  created_at: string;
};

export const STORY_CATEGORIES = [
  'Horror',
  'Mystery',
  'Fiction',
  'Non-Fiction',
  'Romance',
  'Adventure',
  'Fantasy',
  'Poetry'
];

export const ART_SUBCATEGORIES = ['Islamic Art', 'Sketch', 'Landscape', 'Portrait', 'Digital Art'];
export const CALLIGRAPHY_SUBCATEGORIES = [
  'All Names',
  'Quranic Verses',
  'English',
  'Names',
  'Digital Calligraphy'
];
export const BLOG_CATEGORIES = ['Psychology', 'Librarian', 'Islamic', 'Aqwal', 'Motivational'];
