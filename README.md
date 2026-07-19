# Maryam Naveed — Portfolio Website

Next.js + Supabase project: Art gallery, Calligraphy, and a Library & Books
section with star ratings, reviews, PDF download and an online reader.
An Admin page lets you upload new art, calligraphy and books.

## 1. Install Node.js

Download and install Node.js (v18 or newer) from https://nodejs.org

## 2. Install project dependencies

Open a terminal inside this folder and run:

```
npm install
```

## 3. Create a free Supabase project

1. Go to https://supabase.com and sign up (free).
2. Click "New project", give it a name and a database password.
3. Once created, go to **Project Settings → API**. Copy:
   - Project URL
   - anon public key

## 4. Set up environment variables

1. Copy `.env.local.example` to a new file named `.env.local`
2. Paste your Project URL and anon key into it.

## 5. Set up the database and storage

1. In Supabase, go to **SQL Editor**.
2. Open `supabase/schema.sql` from this project, copy all of it, paste it
   into the SQL Editor, and click "Run".
   This creates the `arts` and `books` tables, plus 3 storage buckets
   (`art-images`, `book-pdfs`, `book-covers`) with the correct permissions.

## 6. Create your admin login

1. In Supabase, go to **Authentication → Users → Add user**.
2. Enter the email and password you want to use to log into `/admin`.
3. That's it — no separate admin table needed, Supabase handles login.

## 7. Run the website locally

```
npm run dev
```

Open http://localhost:3000 in your browser — this is the public website.
Open http://localhost:3000/admin to log in and upload art, calligraphy and
books.

## 8. Put the website online (free)

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, sign up with GitHub, and import the repository.
3. In Vercel's project settings, add the same environment variables from
   your `.env.local` file.
4. Click Deploy. Vercel gives you a live link you can share with anyone.

## How everything fits together

- **Public homepage** (`app/page.tsx`) reads directly from the Supabase
  `arts` and `books` tables — anyone visiting the site sees this, no login
  needed.
- **Admin page** (`app/admin/page.tsx`) is locked behind Supabase login.
  Only you can upload new art, calligraphy, or books there. As soon as you
  upload something, it's saved to the database and storage, and will show
  up on the public homepage automatically.
- **Images and PDFs** are stored in Supabase Storage buckets, not in the
  database itself — the database only stores the *link* to each file, so
  it stays fast even as your library grows.
- **Book reader**: clicking a book opens a modal with the PDF loaded in an
  embedded viewer for online reading, plus a direct Download PDF button.

## Need changes?

Colors live in `tailwind.config.js` under the `pink`, `ink`, and `gold`
keys. Text content lives directly inside each component file in
`components/` and `app/`.

## Updating an existing project

If you already ran `schema.sql` once before, just run it again — every
statement uses `if not exists` / `drop policy if exists`, so it's safe to
re-run any time you pull new changes. It will only add what's missing
(new columns like `subcategory`, `language`, `category`, plus the new
`settings` and `comments` tables) without touching your existing data.
