-- ============================================================
-- Remove the Shop / Product / Order system from Supabase
-- ============================================================
-- Run this once in Supabase → SQL Editor.
--
-- Safety check performed before writing this migration: no other table
-- in the schema has a foreign key referencing `products`,
-- `product_categories`, or `orders`, and no other feature (art,
-- calligraphy, books, audiobooks, blog, chat, resume requests, comments,
-- messages, settings) reads from or writes to these tables. They were
-- used exclusively by the removed Shop feature, so dropping them will
-- not break anything else on the site.
--
-- This does NOT touch any other table - your art, calligraphy, books,
-- audiobooks, blog posts, chat history, resume requests, comments, and
-- settings are all left completely untouched.

-- 1. Drop the tables (this also drops their RLS policies automatically).
--    `orders` and `products` are dropped before `product_categories`
--    since `products.category_id` references it.
drop table if exists orders cascade;
drop table if exists products cascade;
drop table if exists product_categories cascade;

-- 2. Remove the product-images storage bucket.
--    Supabase blocks direct SQL deletes on storage.objects/storage.buckets
--    (the error you just saw) - that table can only be modified through
--    their Storage API, which the dashboard UI already uses correctly.
--    So do this step by hand instead, it takes 10 seconds:
--      Supabase Dashboard → Storage → click the "product-images" bucket
--      → the "..." menu → Delete bucket.
--    (Totally optional - if you'd rather keep those old product photos
--    around, just leave the bucket there. It's not used by anything
--    anymore either way.)

-- 3. Sanity check - this should return zero rows, confirming the shop
--    tables are gone (the bucket check is left out since it can only be
--    removed via the dashboard, per step 2 above).
select table_name from information_schema.tables
where table_schema = 'public' and table_name in ('products', 'product_categories', 'orders');
