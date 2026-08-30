-- Supabase-compatible PostgreSQL schema for a second-hand book marketplace
-- Tables: profiles, books, book_images, favorites
-- Row Level Security enabled with policies for user-owned management and public active book views

-- Profiles table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  college text,
  city text,
  avatar_url text,
  created_at timestamp with time zone not null default now()
);

create index if not exists profiles_full_name_idx on public.profiles(lower(full_name));
create index if not exists profiles_city_idx on public.profiles(city);
create index if not exists profiles_college_idx on public.profiles(college);

alter table public.profiles enable row level security;

create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

-- Public read for seller profiles (regular and anonymous visitors).
-- Only sellers with at least one active listing are exposed to non-owners.
create policy profiles_select_public on public.profiles
  for select using (exists (
    select 1 from public.books b where b.seller_id = profiles.id and b.status = 'active'
  ));

create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);

create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy profiles_delete_own on public.profiles
  for delete using (auth.uid() = id);

-- Books table
create table if not exists public.books (
  id uuid not null primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  author text not null,
  isbn text,
  category text,
  subject text,
  condition text,
  description text,
  original_price numeric(10,2),
  selling_price numeric(10,2) not null,
  college text,
  branch text,
  semester text,
  city text,
  status text not null default 'draft',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists books_seller_id_idx on public.books(seller_id);
create index if not exists books_status_idx on public.books(status);
create index if not exists books_created_at_idx on public.books(created_at desc);
create index if not exists books_title_author_idx on public.books(lower(title), lower(author));
create index if not exists books_category_subject_idx on public.books(category, subject);
create index if not exists books_college_city_idx on public.books(college, city);

alter table public.books enable row level security;

create policy books_select_active on public.books
  for select using (status = 'active');

create policy books_select_own on public.books
  for select using (auth.uid() = seller_id);

create policy books_insert_own on public.books
  for insert with check (auth.uid() = seller_id);

create policy books_update_own on public.books
  for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy books_delete_own on public.books
  for delete using (auth.uid() = seller_id);

-- Book images table
create table if not exists public.book_images (
  id uuid not null primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  image_url text not null,
  display_order int not null default 1
);

create index if not exists book_images_book_id_idx on public.book_images(book_id);
create index if not exists book_images_display_order_idx on public.book_images(book_id, display_order);

alter table public.book_images enable row level security;

create policy book_images_select_based_on_book on public.book_images
  for select using (exists (
    select 1 from public.books b where b.id = book_images.book_id and (
      b.status = 'active' or b.seller_id = auth.uid()
    )
  ));

create policy book_images_insert_own on public.book_images
  for insert with check (exists (
    select 1 from public.books b where b.id = book_images.book_id and b.seller_id = auth.uid()
  ));

create policy book_images_update_own on public.book_images
  for update using (exists (
    select 1 from public.books b where b.id = book_images.book_id and b.seller_id = auth.uid()
  )) with check (exists (
    select 1 from public.books b where b.id = book_images.book_id and b.seller_id = auth.uid()
  ));

create policy book_images_delete_own on public.book_images
  for delete using (exists (
    select 1 from public.books b where b.id = book_images.book_id and b.seller_id = auth.uid()
  ));

-- Favorites table
create table if not exists public.favorites (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  constraint favorites_unique_user_book unique (user_id, book_id)
);

create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_book_id_idx on public.favorites(book_id);
create index if not exists favorites_created_at_idx on public.favorites(created_at desc);

alter table public.favorites enable row level security;

create policy favorites_select_own on public.favorites
  for select using (auth.uid() = user_id);

create policy favorites_insert_own on public.favorites
  for insert with check (auth.uid() = user_id);

create policy favorites_delete_own on public.favorites
  for delete using (auth.uid() = user_id);

-- Allow authenticated and anonymous users to select active books and related images
grant select on public.books to authenticated;
grant select on public.book_images to authenticated;
grant select on public.books to anon;
grant select on public.book_images to anon;

-- Allow viewing seller profiles for buyer-facing pages
grant select on public.profiles to authenticated;
grant select on public.profiles to anon;

-- Helpful function to keep updated_at current on books
create or replace function public.update_books_modified_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at_trigger
  before update on public.books
  for each row execute function public.update_books_modified_timestamp();
