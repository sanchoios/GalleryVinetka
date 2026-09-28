-- Run AFTER creating the owner user in Authentication → Users.
-- Replace the email. This is the only way to grant admin access.

insert into public.profiles (id, role)
select id, 'owner'
from auth.users
where email = 'owner@example.com'
on conflict (id) do update set role = 'owner';
