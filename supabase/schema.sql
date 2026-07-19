-- Run this once in Supabase Dashboard -> SQL Editor

-- 1. ARTS table (covers both "Art gallery" and "Calligraphy",
--    differentiated by the "category" column, with a "subcategory" tag)
create table if not exists arts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('art', 'calligraphy')),
  subcategory text not null default 'All',
  description text,
  image_url text not null,
  created_at timestamp with time zone default now()
);

alter table arts add column if not exists subcategory text not null default 'All';

-- 2. BOOKS table (with language: Urdu / English)
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

-- SETTINGS table (single row - global site settings like comments on/off)
create table if not exists settings (
  id int primary key default 1,
  comments_enabled boolean not null default true
);
insert into settings (id, comments_enabled) values (1, true)
on conflict (id) do nothing;

alter table settings enable row level security;
drop policy if exists "Public can read settings" on settings;
create policy "Public can read settings" on settings for select using (true);
drop policy if exists "Authenticated can update settings" on settings;
create policy "Authenticated can update settings" on settings for update to authenticated using (true);

-- COMMENTS table (reader views on art or books)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('art', 'book')),
  item_id uuid not null,
  name text not null,
  comment text not null,
  created_at timestamp with time zone default now()
);

alter table comments enable row level security;
drop policy if exists "Public can read comments" on comments;
create policy "Public can read comments" on comments for select using (true);
drop policy if exists "Public can add comments" on comments;
create policy "Public can add comments" on comments for insert to anon, authenticated with check (true);
drop policy if exists "Authenticated can delete comments" on comments;
create policy "Authenticated can delete comments" on comments for delete to authenticated using (true);

-- 3. MESSAGES table (contact form submissions from "Request consultation")
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

-- Anyone visiting the site can send a message
create policy "Public can send messages"
  on messages for insert
  to anon, authenticated
  with check (true);

-- Only the logged-in admin can read, update (mark as read) or delete messages
create policy "Only authenticated can read messages"
  on messages for select
  to authenticated
  using (true);

create policy "Only authenticated can update messages"
  on messages for update
  to authenticated
  using (true);

create policy "Only authenticated can delete messages"
  on messages for delete
  to authenticated
  using (true);

-- 5. BLOGS table
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
create policy "Public can read blogs"
  on blogs for select
  using (true);

drop policy if exists "Authenticated can insert blogs" on blogs;
create policy "Authenticated can insert blogs"
  on blogs for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update blogs" on blogs;
create policy "Authenticated can update blogs"
  on blogs for update
  to authenticated
  using (true);

drop policy if exists "Authenticated can delete blogs" on blogs;
create policy "Authenticated can delete blogs"
  on blogs for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public read blog-covers" on storage.objects;
create policy "Public read blog-covers"
  on storage.objects for select
  using (bucket_id = 'blog-covers');

drop policy if exists "Authenticated upload blog-covers" on storage.objects;
create policy "Authenticated upload blog-covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-covers');
alter table arts enable row level security;
alter table books enable row level security;

create policy "Public can read arts"
  on arts for select
  using (true);

create policy "Public can read books"
  on books for select
  using (true);

create policy "Only authenticated users can insert arts"
  on arts for insert
  to authenticated
  with check (true);

create policy "Only authenticated users can insert books"
  on books for insert
  to authenticated
  with check (true);

create policy "Only authenticated users can delete arts"
  on arts for delete
  to authenticated
  using (true);

create policy "Only authenticated users can delete books"
  on books for delete
  to authenticated
  using (true);

-- 4. Storage buckets (create these in Dashboard -> Storage, or via SQL below)
insert into storage.buckets (id, name, public)
values ('art-images', 'art-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('book-pdfs', 'book-pdfs', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('book-covers', 'book-covers', true)
on conflict (id) do nothing;

-- Storage policies: public read, authenticated write
create policy "Public read art-images"
  on storage.objects for select
  using (bucket_id = 'art-images');

create policy "Authenticated upload art-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'art-images');

create policy "Public read book-pdfs"
  on storage.objects for select
  using (bucket_id = 'book-pdfs');

create policy "Authenticated upload book-pdfs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'book-pdfs');

create policy "Public read book-covers"
  on storage.objects for select
  using (bucket_id = 'book-covers');

create policy "Authenticated upload book-covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'book-covers');
