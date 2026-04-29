-- Use this query in the Supabase SQL Editor to create an admin account.

-- 1. Temporarily modify the email check function to allow the admin email
CREATE OR REPLACE FUNCTION private.enforce_aiub_auth_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT private.is_aiub_email(new.email) AND new.email != 'admin@aiub.edu' THEN
    RAISE EXCEPTION 'Only AIUB student emails like 23-51455-1@student.aiub.edu are allowed.';
  END IF;
  RETURN NEW;
END;
$$;

-- Disable the role escalation trigger (this works because 'postgres' owns public.profiles)
ALTER TABLE public.profiles DISABLE TRIGGER prevent_student_role_escalation;

-- 2. Insert the admin user into Supabase auth
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@aiub.edu',
  crypt('admin123', gen_salt('bf')), -- Change 'admin123' to your desired password
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert the required identity into auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin000-0000-0000-0000-000000000000',
  format('{"sub":"%s","email":"%s"}', 'admin000-0000-0000-0000-000000000000', 'admin@aiub.edu')::jsonb,
  'email',
  'admin@aiub.edu',
  now(),
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- 4. Update the created profile role to 'admin' (The profile was auto-created by handle_new_user trigger)
UPDATE public.profiles
SET role = 'admin', full_name = 'Admin User'
WHERE id = 'admin000-0000-0000-0000-000000000000';

-- 5. Grant admin privileges by inserting into public.admin_roles
INSERT INTO public.admin_roles (user_id)
VALUES ('admin000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- 6. Re-enable the protective triggers
CREATE OR REPLACE FUNCTION private.enforce_aiub_auth_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT private.is_aiub_email(new.email) THEN
    RAISE EXCEPTION 'Only AIUB student emails like 23-51455-1@student.aiub.edu are allowed.';
  END IF;
  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles ENABLE TRIGGER prevent_student_role_escalation;
