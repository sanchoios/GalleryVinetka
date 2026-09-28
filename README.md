# FOLIO Yearbook Studio

React + Vite + TypeScript storefront with a private Supabase-backed admin panel.

The public website keeps its existing design. After you connect Supabase, albums, Our Work, logos, contacts and site copy load from the database. Until then, the site still renders the original seeded content so local preview works.

**This environment does not have your Supabase project.** The code, SQL and admin UI are complete, but they are not connected or live-tested against a real project. Follow the steps below.

## 1. Create a Supabase project

1. Open [supabase.com](https://supabase.com) and create a project.
2. Copy the **Project URL** and **anon public** key (Settings → API).
3. Do **not** put the `service_role` key in this frontend repo.

```bash
cp .env.example .env.local
```

Fill:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

## 2. Database, RLS and Storage

In the Supabase SQL editor, run in order:

1. `supabase/migrations/001_schema.sql` — tables, `is_owner()`, Row Level Security, `media` storage bucket.
2. `supabase/migrations/002_seed.sql` — current website content. Safe to re-run: `ON CONFLICT DO NOTHING`, so later owner edits are not overwritten.

Seeded image paths (`/images/...`) point at files already in `public/images/`. New uploads go to the public `media` Storage bucket.

**Important:** Storage objects are publicly readable by URL. Hiding or unpublishing an album removes it from public lists and the public detail route; it does **not** make an already-known image URL private.

## 3. Owner account (no public signup)

1. Authentication → Providers → Email: enable Email.
2. Disable public sign-ups: Authentication → Providers → Email → **Confirm email** as you prefer, and in Authentication → Settings turn **off** “Allow new users to sign up” if the UI offers it. There is no register screen in this app.
3. Authentication → Users → **Add user** with the owner email and a strong password (auto-confirm the email).
4. Run `supabase/ASSIGN_OWNER.sql` with that email. Being logged in is not enough — `profiles.role` must be `owner`. Clients cannot change this through the API.

Password recovery: Authentication → URL Configuration → add `https://YOUR_DOMAIN/admin/reset-password` (and `http://localhost:5173/admin/reset-password` for local). The login page “Parolni unutdingizmi?” uses this.

## 4. Admin

Open `/admin/login`. There is **no** admin link in the public header or footer.

Sidebar (Uzbek labels): Albomlar, Our Work, Bosh sahifa, Universitet logolari, Kontaktlar, Sayt sozlamalari.

- Published albums appear on the homepage, catalog and `/albums/:slug`. Hidden ones do not.
- Prices come from each album’s `price_uzs` (formatted like `950,000 UZS`).
- Orders go to the global Telegram URL, with an optional per-album override. No cart, checkout or payments.

## 5. Hosting SPA routes

Configure the host to serve `index.html` for unknown paths so `/admin`, `/admin/login` and `/albums/noir` work when opened directly.

Examples:

- Netlify: `/* /index.html 200`
- Vercel: rewrite `/(.*) → /index.html`
- Nginx: `try_files $uri /index.html;`

Admin pages send `noindex, nofollow`. That is extra; authentication is still required.

## 6. What you should verify after connecting

- Create an album → card and detail page appear when published.
- Edit price or images → public site updates after refresh.
- Hide/delete an album → public list and `/albums/slug` no longer show it.
- Our Work uploads persist and show in the gallery.
- Logged-out visitors and non-owner accounts cannot insert/update/delete rows or Storage objects (try the REST API with the anon key).
- Existing navigation, catalog filters, galleries and Telegram buttons still work.

## Local development

```bash
npm install
npm run dev
```
