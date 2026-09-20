-- Run this once in Supabase Dashboard -> SQL Editor
-- Safe to re-run any time (every statement uses IF NOT EXISTS / DROP POLICY IF EXISTS)

-- ============ 1. ARTS table (Art gallery + Calligraphy) ============
create table if not exists arts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('art', 'calligraphy')),
  subcategory text not null default 'All',
  description text,
  image_url text not null,
  before_after_gif_url text,
  created_at timestamp with time zone default now()
);
alter table arts add column if not exists subcategory text not null default 'All';
alter table arts add column if not exists before_after_gif_url text;
alter table arts enable row level security;

drop policy if exists "Public can read arts" on arts;
create policy "Public can read arts" on arts for select using (true);

drop policy if exists "Only authenticated users can insert arts" on arts;
create policy "Only authenticated users can insert arts"
  on arts for insert to authenticated with check (true);

drop policy if exists "Only authenticated users can update arts" on arts;
create policy "Only authenticated users can update arts"
  on arts for update to authenticated using (true);

drop policy if exists "Only authenticated users can delete arts" on arts;
create policy "Only authenticated users can delete arts"
  on arts for delete to authenticated using (true);

-- ============ 2. BOOKS table ============
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  language text not null default 'English' check (language in ('Urdu', 'English')),
  cover_image_url text,
  pdf_url text not null,
  review text,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamp with time zone default now()
);
alter table books add column if not exists language text not null default 'English';
alter table books enable row level security;

drop policy if exists "Public can read books" on books;
create policy "Public can read books" on books for select using (true);

drop policy if exists "Only authenticated users can insert books" on books;
create policy "Only authenticated users can insert books"
  on books for insert to authenticated with check (true);

drop policy if exists "Only authenticated users can update books" on books;
create policy "Only authenticated users can update books"
  on books for update to authenticated using (true);

drop policy if exists "Only authenticated users can delete books" on books;
create policy "Only authenticated users can delete books"
  on books for delete to authenticated using (true);

-- ============ 3. MESSAGES table (Feedback form submissions) ============
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default now()
);
alter table messages enable row level security;

drop policy if exists "Public can send messages" on messages;
create policy "Public can send messages"
  on messages for insert to anon, authenticated with check (true);

drop policy if exists "Only authenticated can read messages" on messages;
create policy "Only authenticated can read messages"
  on messages for select to authenticated using (true);

drop policy if exists "Only authenticated can update messages" on messages;
create policy "Only authenticated can update messages"
  on messages for update to authenticated using (true);

drop policy if exists "Only authenticated can delete messages" on messages;
create policy "Only authenticated can delete messages"
  on messages for delete to authenticated using (true);

-- ============ 4. BLOGS table ============
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null default 'General',
  cover_image_url text,
  created_at timestamp with time zone default now()
);
alter table blogs add column if not exists category text not null default 'General';
alter table blogs enable row level security;

drop policy if exists "Public can read blogs" on blogs;
create policy "Public can read blogs" on blogs for select using (true);

drop policy if exists "Authenticated can insert blogs" on blogs;
create policy "Authenticated can insert blogs"
  on blogs for insert to authenticated with check (true);

drop policy if exists "Authenticated can update blogs" on blogs;
create policy "Authenticated can update blogs"
  on blogs for update to authenticated using (true);

drop policy if exists "Authenticated can delete blogs" on blogs;
create policy "Authenticated can delete blogs"
  on blogs for delete to authenticated using (true);

-- ============ 5. SETTINGS table (single row - comments on/off) ============
create table if not exists settings (
  id int primary key default 1,
  comments_enabled boolean not null default true,
  quote_of_day text not null default 'Every book tells a story. Every artwork expresses an emotion. Every mind holds a unique perspective.',
  background_image_url text,
  profile_image_url text
);
insert into settings (id, comments_enabled) values (1, true)
on conflict (id) do nothing;
alter table settings add column if not exists quote_of_day text not null default 'Every book tells a story. Every artwork expresses an emotion. Every mind holds a unique perspective.';
alter table settings add column if not exists background_image_url text;
alter table settings add column if not exists profile_image_url text;
alter table settings add column if not exists resume_url text;
alter table settings enable row level security;

drop policy if exists "Public can read settings" on settings;
create policy "Public can read settings" on settings for select using (true);

drop policy if exists "Authenticated can update settings" on settings;
create policy "Authenticated can update settings"
  on settings for update to authenticated using (true);

-- ============ 6. COMMENTS table (reader views on art/books) ============
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('art', 'book')),
  item_id uuid not null,
  item_title text,
  name text not null,
  comment text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default now()
);
alter table comments add column if not exists item_title text;
alter table comments add column if not exists is_read boolean not null default false;
alter table comments enable row level security;

drop policy if exists "Public can read comments" on comments;
create policy "Public can read comments" on comments for select using (true);

drop policy if exists "Public can add comments" on comments;
create policy "Public can add comments"
  on comments for insert to anon, authenticated with check (true);

drop policy if exists "Authenticated can update comments" on comments;
create policy "Authenticated can update comments"
  on comments for update to authenticated using (true);

drop policy if exists "Authenticated can delete comments" on comments;
create policy "Authenticated can delete comments"
  on comments for delete to authenticated using (true);

-- ============ 8. RESUME REQUESTS table (Nav "Request Resume" flow) ============
create table if not exists resume_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'downloaded')),
  created_at timestamp with time zone default now()
);
alter table resume_requests enable row level security;

-- Widen the status check for databases that already ran an earlier version
-- of this schema (before "downloaded" existed as a status).
alter table resume_requests drop constraint if exists resume_requests_status_check;
alter table resume_requests add constraint resume_requests_status_check
  check (status in ('pending', 'approved', 'rejected', 'downloaded'));

drop policy if exists "Public can send resume requests" on resume_requests;
create policy "Public can send resume requests"
  on resume_requests for insert to anon, authenticated with check (true);

-- Visitor needs to read back the status of their own request id from the
-- browser, and there's no visitor login system, so read access is open
-- (same trust model already used for the "comments" table above).
drop policy if exists "Public can read resume requests" on resume_requests;
create policy "Public can read resume requests" on resume_requests for select using (true);

drop policy if exists "Authenticated can update resume requests" on resume_requests;
create policy "Authenticated can update resume requests"
  on resume_requests for update to authenticated using (true);

drop policy if exists "Authenticated can delete resume requests" on resume_requests;
create policy "Authenticated can delete resume requests"
  on resume_requests for delete to authenticated using (true);

-- ============ 9. CHAT MESSAGES table ("Talk to Admin" widget) ============
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  name text not null,
  sender text not null check (sender in ('user', 'admin')),
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default now()
);
alter table chat_messages enable row level security;

drop policy if exists "Public can send chat messages" on chat_messages;
create policy "Public can send chat messages"
  on chat_messages for insert to anon, authenticated with check (true);

-- Visitors poll their own visitor_id thread from the browser (no login
-- system for visitors), so read access is open, same as "comments" above.
drop policy if exists "Public can read chat messages" on chat_messages;
create policy "Public can read chat messages" on chat_messages for select using (true);

drop policy if exists "Authenticated can update chat messages" on chat_messages;
create policy "Authenticated can update chat messages"
  on chat_messages for update to authenticated using (true);

drop policy if exists "Authenticated can delete chat messages" on chat_messages;
create policy "Authenticated can delete chat messages"
  on chat_messages for delete to authenticated using (true);

-- ============ 10. AUDIO BOOKS table ============
create table if not exists audio_books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  cover_image_url text not null,
  audio_url text not null,
  created_at timestamp with time zone default now()
);
alter table audio_books enable row level security;

drop policy if exists "Public can view audio books" on audio_books;
create policy "Public can view audio books" on audio_books for select using (true);

drop policy if exists "Authenticated can insert audio books" on audio_books;
create policy "Authenticated can insert audio books"
  on audio_books for insert to authenticated with check (true);

drop policy if exists "Authenticated can update audio books" on audio_books;
create policy "Authenticated can update audio books"
  on audio_books for update to authenticated using (true);

drop policy if exists "Authenticated can delete audio books" on audio_books;
create policy "Authenticated can delete audio books"
  on audio_books for delete to authenticated using (true);

-- ============ 11. STORIES table (My Written Stories) ============
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  category text not null,
  description text,
  cover_image_url text,
  pdf_url text not null,
  video_url text,
  created_at timestamp with time zone default now()
);
alter table stories add column if not exists video_url text;
alter table stories enable row level security;

drop policy if exists "Public can view stories" on stories;
create policy "Public can view stories" on stories for select using (true);

drop policy if exists "Authenticated can insert stories" on stories;
create policy "Authenticated can insert stories"
  on stories for insert to authenticated with check (true);

drop policy if exists "Authenticated can update stories" on stories;
create policy "Authenticated can update stories"
  on stories for update to authenticated using (true);

drop policy if exists "Authenticated can delete stories" on stories;
create policy "Authenticated can delete stories"
  on stories for delete to authenticated using (true);

-- Storage bucket for before/after GIFs
insert into storage.buckets (id, name, public) values ('art-before-after', 'art-before-after', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-backgrounds', 'site-backgrounds', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true) on conflict (id) do nothing;

drop policy if exists "Public read art-before-after" on storage.objects;
create policy "Public read art-before-after" on storage.objects for select using (bucket_id = 'art-before-after');

drop policy if exists "Authenticated upload art-before-after" on storage.objects;
create policy "Authenticated upload art-before-after"
  on storage.objects for insert to authenticated with check (bucket_id = 'art-before-after');

drop policy if exists "Public read site-backgrounds" on storage.objects;
create policy "Public read site-backgrounds" on storage.objects for select using (bucket_id = 'site-backgrounds');

drop policy if exists "Authenticated upload site-backgrounds" on storage.objects;
create policy "Authenticated upload site-backgrounds"
  on storage.objects for insert to authenticated with check (bucket_id = 'site-backgrounds');

drop policy if exists "Public read profile-images" on storage.objects;
create policy "Public read profile-images" on storage.objects for select using (bucket_id = 'profile-images');

drop policy if exists "Authenticated upload profile-images" on storage.objects;
create policy "Authenticated upload profile-images"
  on storage.objects for insert to authenticated with check (bucket_id = 'profile-images');

-- ============ 7. STORAGE BUCKETS ============
insert into storage.buckets (id, name, public) values ('art-images', 'art-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('book-pdfs', 'book-pdfs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('book-covers', 'book-covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('blog-covers', 'blog-covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('resume-files', 'resume-files', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('audiobook-covers', 'audiobook-covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('audiobook-files', 'audiobook-files', true) on conflict (id) do nothing;

drop policy if exists "Public read audiobook-covers" on storage.objects;
create policy "Public read audiobook-covers" on storage.objects for select using (bucket_id = 'audiobook-covers');
drop policy if exists "Authenticated upload audiobook-covers" on storage.objects;
create policy "Authenticated upload audiobook-covers"
  on storage.objects for insert to authenticated with check (bucket_id = 'audiobook-covers');

drop policy if exists "Public read audiobook-files" on storage.objects;
create policy "Public read audiobook-files" on storage.objects for select using (bucket_id = 'audiobook-files');
drop policy if exists "Authenticated upload audiobook-files" on storage.objects;
create policy "Authenticated upload audiobook-files"
  on storage.objects for insert to authenticated with check (bucket_id = 'audiobook-files');

drop policy if exists "Public read resume-files" on storage.objects;
create policy "Public read resume-files" on storage.objects for select using (bucket_id = 'resume-files');

drop policy if exists "Authenticated upload resume-files" on storage.objects;
create policy "Authenticated upload resume-files"
  on storage.objects for insert to authenticated with check (bucket_id = 'resume-files');

drop policy if exists "Public read art-images" on storage.objects;
create policy "Public read art-images" on storage.objects for select using (bucket_id = 'art-images');

drop policy if exists "Authenticated upload art-images" on storage.objects;
create policy "Authenticated upload art-images"
  on storage.objects for insert to authenticated with check (bucket_id = 'art-images');

drop policy if exists "Public read book-pdfs" on storage.objects;
create policy "Public read book-pdfs" on storage.objects for select using (bucket_id = 'book-pdfs');

drop policy if exists "Authenticated upload book-pdfs" on storage.objects;
create policy "Authenticated upload book-pdfs"
  on storage.objects for insert to authenticated with check (bucket_id = 'book-pdfs');

drop policy if exists "Public read book-covers" on storage.objects;
create policy "Public read book-covers" on storage.objects for select using (bucket_id = 'book-covers');

drop policy if exists "Authenticated upload book-covers" on storage.objects;
create policy "Authenticated upload book-covers"
  on storage.objects for insert to authenticated with check (bucket_id = 'book-covers');

insert into storage.buckets (id, name, public) values ('story-pdfs', 'story-pdfs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('story-covers', 'story-covers', true) on conflict (id) do nothing;

drop policy if exists "Public read story-pdfs" on storage.objects;
create policy "Public read story-pdfs" on storage.objects for select using (bucket_id = 'story-pdfs');

drop policy if exists "Authenticated upload story-pdfs" on storage.objects;
create policy "Authenticated upload story-pdfs"
  on storage.objects for insert to authenticated with check (bucket_id = 'story-pdfs');

drop policy if exists "Public read story-covers" on storage.objects;
create policy "Public read story-covers" on storage.objects for select using (bucket_id = 'story-covers');

drop policy if exists "Authenticated upload story-covers" on storage.objects;
create policy "Authenticated upload story-covers"
  on storage.objects for insert to authenticated with check (bucket_id = 'story-covers');

insert into storage.buckets (id, name, public) values ('story-videos', 'story-videos', true) on conflict (id) do nothing;

drop policy if exists "Public read story-videos" on storage.objects;
create policy "Public read story-videos" on storage.objects for select using (bucket_id = 'story-videos');

drop policy if exists "Authenticated upload story-videos" on storage.objects;
create policy "Authenticated upload story-videos"
  on storage.objects for insert to authenticated with check (bucket_id = 'story-videos');

drop policy if exists "Public read blog-covers" on storage.objects;
create policy "Public read blog-covers" on storage.objects for select using (bucket_id = 'blog-covers');

drop policy if exists "Authenticated upload blog-covers" on storage.objects;
create policy "Authenticated upload blog-covers"
  on storage.objects for insert to authenticated with check (bucket_id = 'blog-covers');
