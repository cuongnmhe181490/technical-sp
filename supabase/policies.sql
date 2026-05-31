-- =============================================================
-- AutoWeb Studio - Row Level Security policies
-- Run AFTER schema.sql.
--
-- Strategy:
--  * SECURITY DEFINER helper functions avoid recursive policy
--    evaluation (a classic Supabase footgun where a policy on
--    room_members queries room_members again).
--  * Admins (profiles.role = 'admin') can see everything.
--  * Clients/collaborators only see rooms they are a member of.
-- =============================================================

-- Helper: is the current user an admin? -----------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: is the current user a member of a given room? -------
create or replace function public.is_room_member(target_room uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.room_members
    where room_id = target_room and user_id = auth.uid()
  );
$$;

-- Helper: can the current user see this profile? -------------
-- True for self, admins, and anyone sharing at least one room.
create or replace function public.can_see_profile(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    target_user = auth.uid()
    or public.is_admin()
    or exists (
      select 1
      from public.room_members a
      join public.room_members b on a.room_id = b.room_id
      where a.user_id = auth.uid() and b.user_id = target_user
    );
$$;

-- Helper: does the current user own/belong to a project? ------
create or replace function public.can_see_project(target_project uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = target_project and p.client_id = auth.uid()
    )
    or exists (
      select 1
      from public.rooms r
      join public.room_members m on m.room_id = r.id
      where r.project_id = target_project and m.user_id = auth.uid()
    );
$$;

-- Enable RLS everywhere --------------------------------------
alter table public.profiles      enable row level security;
alter table public.projects      enable row level security;
alter table public.rooms         enable row level security;
alter table public.room_members  enable row level security;
alter table public.messages      enable row level security;
alter table public.project_files enable row level security;

-- =============================================================
-- profiles
-- =============================================================
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (public.can_see_profile(id));

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Inserts happen via the auth trigger (security definer), so no
-- public insert policy is needed for normal flows.

-- =============================================================
-- projects
-- =============================================================
drop policy if exists "projects_select" on public.projects;
create policy "projects_select"
  on public.projects for select
  using (public.is_admin() or client_id = auth.uid());

drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert"
  on public.projects for insert
  with check (public.is_admin() or client_id = auth.uid());

drop policy if exists "projects_update" on public.projects;
create policy "projects_update"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================
-- rooms
-- =============================================================
drop policy if exists "rooms_select" on public.rooms;
create policy "rooms_select"
  on public.rooms for select
  using (public.is_admin() or public.is_room_member(id));

drop policy if exists "rooms_insert" on public.rooms;
create policy "rooms_insert"
  on public.rooms for insert
  with check (public.is_admin());

-- =============================================================
-- room_members
-- =============================================================
drop policy if exists "room_members_select" on public.room_members;
create policy "room_members_select"
  on public.room_members for select
  using (public.is_admin() or user_id = auth.uid() or public.is_room_member(room_id));

drop policy if exists "room_members_insert" on public.room_members;
create policy "room_members_insert"
  on public.room_members for insert
  with check (public.is_admin());

drop policy if exists "room_members_delete" on public.room_members;
create policy "room_members_delete"
  on public.room_members for delete
  using (public.is_admin());

-- =============================================================
-- messages
-- =============================================================
drop policy if exists "messages_select" on public.messages;
create policy "messages_select"
  on public.messages for select
  using (public.is_admin() or public.is_room_member(room_id));

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and (public.is_admin() or public.is_room_member(room_id))
  );

-- =============================================================
-- project_files
-- =============================================================
drop policy if exists "project_files_select" on public.project_files;
create policy "project_files_select"
  on public.project_files for select
  using (public.can_see_project(project_id));

drop policy if exists "project_files_insert" on public.project_files;
create policy "project_files_insert"
  on public.project_files for insert
  with check (public.can_see_project(project_id) and uploaded_by = auth.uid());

-- =============================================================
-- Storage bucket for uploads (public read, authed write).
-- =============================================================
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

drop policy if exists "storage_read_project_files" on storage.objects;
create policy "storage_read_project_files"
  on storage.objects for select
  using (bucket_id = 'project-files');

drop policy if exists "storage_write_project_files" on storage.objects;
create policy "storage_write_project_files"
  on storage.objects for insert
  with check (bucket_id = 'project-files' and auth.role() = 'authenticated');
