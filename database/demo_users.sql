-- Demo Users Setup for Meditrack
-- Run this in your Supabase SQL Editor to create demo accounts

-- Note: You'll need to create these users through Supabase Auth first, then update their profiles
-- This script only creates the profile data

-- Insert demo user profiles
-- These UUIDs are placeholders - you'll need to replace them with actual user IDs from Supabase Auth

-- Demo Admin User Profile
INSERT INTO public.profiles (id, email, full_name, role, department, phone)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual admin user ID
  'admin@meditrack.com',
  'Demo Administrator',
  'admin',
  'Administration',
  '+1-555-0101'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  phone = EXCLUDED.phone;

-- Demo Super Admin User Profile
INSERT INTO public.profiles (id, email, full_name, role, department, phone)
VALUES (
  '00000000-0000-0000-0000-000000000002', -- Replace with actual superadmin user ID
  'superadmin@meditrack.com',
  'Demo Super Administrator',
  'admin', -- Note: using 'admin' since 'superadmin' might not be in the enum
  'IT Department',
  '+1-555-0102'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  phone = EXCLUDED.phone;

-- IMPORTANT: To create demo users with confirmed emails:

-- METHOD 1: Using Supabase Dashboard (Recommended)
-- 1. Go to Authentication -> Users in your Supabase dashboard
-- 2. Click "Add User"
-- 3. Create users with:
--    - Email: admin@meditrack.com, Password: admin123, Check "Auto Confirm User"
--    - Email: superadmin@meditrack.com, Password: superadmin123, Check "Auto Confirm User"
-- 4. The profiles will be created automatically via the handle_new_user() trigger

-- METHOD 2: Using SQL (Admin Access Required)
-- If you have RLS disabled or are using service role key:

-- Create confirmed auth users directly
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_sent_at,
  recovery_token,
  email_change_sent_at,
  email_change,
  email_change_confirm_status,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_new,
  email_change_token_current,
  email_change_confirm_status_new
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@meditrack.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  '',
  NULL,
  '',
  NULL,
  '',
  0,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo Administrator"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  '',
  0
), (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'superadmin@meditrack.com',
  crypt('superadmin123', gen_salt('bf')),
  NOW(),
  NOW(),
  '',
  NULL,
  '',
  NULL,
  '',
  0,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo Super Administrator"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  '',
  0
);

-- The profiles will be automatically created by the handle_new_user() trigger