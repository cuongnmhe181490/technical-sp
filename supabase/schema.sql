-- =============================================================
-- AutoWeb Studio - Database schema
-- Run this in the Supabase SQL Editor (or via the CLI) FIRST,
-- then run policies.sql afterwards.
-- =============================================================

-- Extensions -------------------------------------------------
create extension if not exists "pgcrypto";

-- ENUM-ish helper: we use text + check constraints to keep it simple.

-- =============================================================
-- profiles
-- One row per auth user. role drives all access control.
-- =============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'client'
              check (role in ('admin', 'client', 'collaborator')),
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- projects
-- The "bài toán" submitted by a customer.
-- =============================================================
create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid references public.profiles(id) on delete set null,
  title            text not null,
  business_name    text,
  industry         text,
  problem          text,
  current_process  text,
  desired_outcome  text,
  time_wasted      text,
  budget_range     text,
  urgency          text,
  status           text not null default 'new'
                   check (status in ('new', 'analyzing', 'quoted', 'building', 'done')),
  quoted_price     bigint,
  internal_note    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =============================================================
-- rooms
-- A chat room is attached to exactly one project.
-- =============================================================
create table if not exists public.rooms (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- room_members
-- Who is allowed inside a room.
-- =============================================================
create table if not exists public.room_members (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.rooms(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'client'
              check (role in ('owner', 'admin', 'client', 'collaborator')),
  created_at  timestamptz not null default now(),
  unique (room_id, user_id)
);

-- =============================================================
-- messages
-- =============================================================
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references public.rooms(id) on delete cascade,
  sender_id     uuid references public.profiles(id) on delete set null,
  content       text,
  message_type  text not null default 'text'
                check (message_type in ('text', 'system', 'quote', 'file')),
  file_url      text,
  quote_amount  bigint,
  created_at    timestamptz not null default now()
);

-- =============================================================
-- project_files
-- =============================================================
create table if not exists public.project_files (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  uploaded_by  uuid references public.profiles(id) on delete set null,
  file_url     text not null,
  file_name    text,
  file_type    text,
  created_at   timestamptz not null default now()
);

-- Indexes ----------------------------------------------------
create index if not exists idx_projects_client on public.projects(client_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_rooms_project on public.rooms(project_id);
create index if not exists idx_room_members_room on public.room_members(room_id);
create index if not exists idx_room_members_user on public.room_members(user_id);
create index if not exists idx_messages_room on public.messages(room_id, created_at);
create index if not exists idx_project_files_project on public.project_files(project_id);

-- =============================================================
-- Auto-create a profile row whenever an auth user is created.
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep projects.updated_at fresh ------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- Realtime: make sure messages stream to subscribers ----------
alter publication supabase_realtime add table public.messages;
