create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id text primary key,
  code text not null,
  title text not null,
  semester int,
  prerequisite text,
  credit text not null,
  category text not null check (category in ('core', 'major')),
  major text,
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  file_url text not null,
  file_type text not null,
  material_kind text not null default 'note' check (material_kind in ('note', 'solution', 'slide', 'question', 'other')),
  uploaded_by uuid not null references auth.users(id),
  approval_status text not null default 'approved' check (approval_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.student_submissions (
  id uuid primary key default gen_random_uuid(),
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  file_url text not null,
  file_type text not null,
  material_kind text not null default 'note' check (material_kind in ('note', 'solution', 'slide', 'question', 'other')),
  student_id uuid not null references auth.users(id) on delete cascade,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  review_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notes_course_status_idx on public.notes(course_id, approval_status, created_at desc);
create index if not exists notes_uploaded_by_idx on public.notes(uploaded_by);
create index if not exists submissions_course_idx on public.student_submissions(course_id);
create index if not exists submissions_student_idx on public.student_submissions(student_id, created_at desc);
create index if not exists submissions_reviewed_by_idx on public.student_submissions(reviewed_by);
create index if not exists submissions_status_idx on public.student_submissions(approval_status, created_at);

create or replace function private.is_aiub_email(email text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select lower(coalesce(email, '')) ~ '^[0-9]{2}-[0-9]{5}-[0-9]@student\\.aiub\\.edu$'
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_roles
    where user_id = (select auth.uid())
  )
$$;

create or replace function private.enforce_aiub_auth_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_aiub_email(new.email) then
    raise exception 'Only AIUB student emails like 23-51455-1@student.aiub.edu are allowed.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_aiub_email_before_auth_user on auth.users;
create trigger enforce_aiub_email_before_auth_user
before insert or update of email on auth.users
for each row execute function private.enforce_aiub_auth_email();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'student'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_aiub_notes on auth.users;
create trigger on_auth_user_created_aiub_notes
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.prevent_student_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not private.is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_student_role_escalation on public.profiles;
create trigger prevent_student_role_escalation
before update of role on public.profiles
for each row execute function private.prevent_student_role_escalation();

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.courses enable row level security;
alter table public.notes enable row level security;
alter table public.student_submissions enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or (select private.is_admin()));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id or (select private.is_admin()))
with check ((select auth.uid()) = id or (select private.is_admin()));

drop policy if exists "admin_roles_select_admin" on public.admin_roles;
create policy "admin_roles_select_admin"
on public.admin_roles for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "admin_roles_manage_admin" on public.admin_roles;
drop policy if exists "admin_roles_insert_admin" on public.admin_roles;
drop policy if exists "admin_roles_update_admin" on public.admin_roles;
drop policy if exists "admin_roles_delete_admin" on public.admin_roles;
create policy "admin_roles_insert_admin"
on public.admin_roles for insert
to authenticated
with check ((select private.is_admin()));
create policy "admin_roles_update_admin"
on public.admin_roles for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy "admin_roles_delete_admin"
on public.admin_roles for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "courses_select_authenticated" on public.courses;
create policy "courses_select_authenticated"
on public.courses for select
to authenticated
using (true);

drop policy if exists "courses_manage_admin" on public.courses;
drop policy if exists "courses_insert_admin" on public.courses;
drop policy if exists "courses_update_admin" on public.courses;
drop policy if exists "courses_delete_admin" on public.courses;
create policy "courses_insert_admin"
on public.courses for insert
to authenticated
with check ((select private.is_admin()));
create policy "courses_update_admin"
on public.courses for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy "courses_delete_admin"
on public.courses for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "notes_select_approved_or_admin" on public.notes;
create policy "notes_select_approved_or_admin"
on public.notes for select
to authenticated
using (approval_status = 'approved' or uploaded_by = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "notes_manage_admin" on public.notes;
drop policy if exists "notes_insert_admin" on public.notes;
drop policy if exists "notes_update_admin" on public.notes;
drop policy if exists "notes_delete_admin" on public.notes;
create policy "notes_insert_admin"
on public.notes for insert
to authenticated
with check ((select private.is_admin()));
create policy "notes_update_admin"
on public.notes for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy "notes_delete_admin"
on public.notes for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "submissions_select_own_or_admin" on public.student_submissions;
create policy "submissions_select_own_or_admin"
on public.student_submissions for select
to authenticated
using (student_id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "submissions_insert_own_pending" on public.student_submissions;
create policy "submissions_insert_own_pending"
on public.student_submissions for insert
to authenticated
with check (
  student_id = (select auth.uid())
  and approval_status = 'pending'
);

drop policy if exists "submissions_review_admin" on public.student_submissions;
create policy "submissions_review_admin"
on public.student_submissions for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

drop policy if exists "materials_read_approved_owner_admin" on storage.objects;
create policy "materials_read_approved_owner_admin"
on storage.objects for select
to authenticated
using (
  bucket_id = 'materials'
  and (
    (storage.foldername(name))[1] = 'approved'
    or ((storage.foldername(name))[1] = 'submissions' and (storage.foldername(name))[2] = (select auth.uid())::text)
    or (select private.is_admin())
  )
);

drop policy if exists "materials_student_upload_submissions" on storage.objects;
create policy "materials_student_upload_submissions"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'materials'
  and (storage.foldername(name))[1] = 'submissions'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and storage.extension(name) in ('pdf', 'ppt', 'pptx', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'webp')
);

drop policy if exists "materials_admin_all" on storage.objects;
create policy "materials_admin_all"
on storage.objects for all
to authenticated
using (bucket_id = 'materials' and (select private.is_admin()))
with check (bucket_id = 'materials' and (select private.is_admin()));

grant usage on schema public to anon, authenticated;
grant usage on schema private to authenticated;
grant execute on all functions in schema private to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.admin_roles to authenticated;
grant select, insert, update, delete on public.courses to authenticated;
grant select, insert, update, delete on public.notes to authenticated;
grant select, insert, update, delete on public.student_submissions to authenticated;

-- Bootstrap an admin after their AIUB account exists:
-- insert into public.admin_roles (user_id) values ('00000000-0000-0000-0000-000000000000');
-- update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-000000000000';
