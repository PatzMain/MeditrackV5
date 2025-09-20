-- Debug script to check profiles and auth users
-- Run this in Supabase SQL Editor to debug user/profile issues

-- Check all profiles
SELECT
  id,
  email,
  full_name,
  role,
  department,
  phone,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- Check auth users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Check for users without profiles
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.id as profile_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Check enum values
SELECT unnest(enum_range(NULL::user_role)) as allowed_roles;