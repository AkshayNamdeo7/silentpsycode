-- Run this in the Supabase SQL Editor for the production project (qtxofjscxpvocnvgtjsh).
-- Fixes: seller profile pages and embedded seller data were unreadable by visitors
-- because profiles RLS only allowed a user to select their own row.

-- 1. Allow public (anon + authenticated) read access to seller profiles.
--    Only sellers who currently have at least one active listing are exposed.
create policy profiles_select_public on public.profiles
  for select using (exists (
    select 1 from public.books b where b.seller_id = profiles.id and b.status = 'active'
  ));

-- 2. Grant select on profiles to anon/authenticated roles (needed for the policy to apply).
grant select on public.profiles to anon;
grant select on public.profiles to authenticated;