-- =============================================================
-- Promote a user to admin.
-- 1. Create the user first via /login (sign up) or in the
--    Supabase dashboard (Authentication -> Users -> Add user).
-- 2. Replace the email below and run this in the SQL editor.
-- =============================================================
update public.profiles
set role = 'admin'
where email = 'you@example.com';
