-- FOLIO admin schema, RLS and Storage.
-- Run this in the Supabase SQL editor (or via supabase db push).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth user. Role cannot be self-assigned via the API.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'owner')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------
create table if not exists public.album_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.album_categories(id) on delete set null,
  edition_number text not null default '',
  short_text text not null default '',
  description text not null default '',
  finish text not null default '',
  price_uzs integer not null default 0,
  price_label text not null default '/ student',
  cover_url text not null default '',
  cover_path text,
  telegram_url text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.album_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  url text not null,
  storage_path text,
  alt text not null default '',
  sort_order int not null default 0
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default '',
  image_url text not null default '',
  storage_path text,
  alt text not null default '',
  published boolean not null default false,
  sort_order int not null default 0
);

create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  image_url text not null default '',
  fallback_url text,
  storage_path text,
  published boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  city text not null unique,
  representative_name text not null default '',
  phone text not null default '',
  instagram text not null default '',
  telegram text not null default '',
  marker_left text not null default '50%',
  marker_top text not null default '50%',
  label_side text not null default 'right' check (label_side in ('left', 'right')),
  published boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  brand_name text not null default 'FOLIO',
  brand_descriptor text not null default 'YEARBOOK STUDIO',
  footer_text text not null default '',
  footer_tagline text not null default '',
  contact_email text not null default '',
  telegram_url text not null default 'https://t.me/YOUR_USERNAME',
  instagram_url text not null default '',
  logo_url text not null default '',
  meta_title_home text not null default '',
  meta_description_home text not null default '',
  meta_title_catalog text not null default '',
  meta_description_catalog text not null default '',
  meta_title_work text not null default '',
  meta_description_work text not null default '',
  meta_title_contact text not null default '',
  meta_description_contact text not null default '',
  hero_image_url text not null default '',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_button_text text not null default '',
  hero_button_link text not null default '/catalog',
  albums_heading text not null default 'Albums',
  albums_button_text text not null default '',
  clients_heading text not null default 'Our Clients',
  work_kicker text not null default '',
  work_heading text not null default 'Our Work',
  work_button_text text not null default '',
  location_kicker text not null default '',
  location_heading text not null default '',
  location_description text not null default '',
  contact_kicker text not null default '',
  contact_heading text not null default '',
  contact_intro text not null default ''
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists albums_updated_at on public.albums;
create trigger albums_updated_at before update on public.albums
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Visitors read only published/public rows. Only is_owner() may write.
-- Being authenticated is not enough — role must be 'owner' in profiles.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.album_categories enable row level security;
alter table public.albums enable row level security;
alter table public.album_images enable row level security;
alter table public.work_items enable row level security;
alter table public.client_logos enable row level security;
alter table public.locations enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

-- No insert/update/delete policies on profiles: clients cannot change roles.

drop policy if exists "read categories" on public.album_categories;
create policy "read categories" on public.album_categories
  for select using (true);
drop policy if exists "owner write categories" on public.album_categories;
create policy "owner write categories" on public.album_categories
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "read published albums" on public.albums;
create policy "read published albums" on public.albums
  for select using (published = true or public.is_owner());
drop policy if exists "owner write albums" on public.albums;
create policy "owner write albums" on public.albums
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "read album images of published" on public.album_images;
create policy "read album images of published" on public.album_images
  for select using (
    public.is_owner()
    or exists (select 1 from public.albums a where a.id = album_id and a.published = true)
  );
drop policy if exists "owner write album images" on public.album_images;
create policy "owner write album images" on public.album_images
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "read published work" on public.work_items;
create policy "read published work" on public.work_items
  for select using (published = true or public.is_owner());
drop policy if exists "owner write work" on public.work_items;
create policy "owner write work" on public.work_items
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "read published logos" on public.client_logos;
create policy "read published logos" on public.client_logos
  for select using (published = true or public.is_owner());
drop policy if exists "owner write logos" on public.client_logos;
create policy "owner write logos" on public.client_logos
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "read published locations" on public.locations;
create policy "read published locations" on public.locations
  for select using (published = true or public.is_owner());
drop policy if exists "owner write locations" on public.locations;
create policy "owner write locations" on public.locations
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "read settings" on public.site_settings;
create policy "read settings" on public.site_settings
  for select using (true);
drop policy if exists "owner write settings" on public.site_settings;
create policy "owner write settings" on public.site_settings
  for all using (public.is_owner()) with check (public.is_owner());

-- ---------------------------------------------------------------------------
-- Storage: public bucket so <img src> works. Hiding an album does NOT make
-- existing public URLs private — only the database row is unpublished.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "owner insert media" on storage.objects;
create policy "owner insert media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_owner());

drop policy if exists "owner update media" on storage.objects;
create policy "owner update media" on storage.objects
  for update using (bucket_id = 'media' and public.is_owner())
  with check (bucket_id = 'media' and public.is_owner());

drop policy if exists "owner delete media" on storage.objects;
create policy "owner delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_owner());

grant usage on schema public to anon, authenticated;
grant select on public.album_categories, public.albums, public.album_images, public.work_items, public.client_logos, public.locations, public.site_settings, public.profiles to anon, authenticated;
grant insert, update, delete on public.album_categories, public.albums, public.album_images, public.work_items, public.client_logos, public.locations, public.site_settings to authenticated;
