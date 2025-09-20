-- Demo Users Setup for Meditrack
-- Run this in your Supabase SQL Editor to create demo accounts

-- Note: You'll need to create these users through Supabase Auth first, then update their profiles
-- This script only creates the profile data

-- Insert demo user profiles
-- These UUIDs are placeholders - you'll need to replace them with actual user IDs from Supabase Auth

-- Demo Admin User Profile
INSERT INTO public.profiles (id, email, full_name, role, department, phone)
VALUES (
  '', -- Replace with actual admin user ID
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

-- To create the actual auth users, use the Supabase dashboard:
-- 1. Go to Authentication -> Users in your Supabase dashboard
-- 2. Click "Add User"
-- 3. Create users with:
--    - Email: admin@meditrack.com, Password: admin123
--    - Email: superadmin@meditrack.com, Password: superadmin123
-- 4. Note down their User IDs
-- 5. Replace the placeholder UUIDs above with the actual User IDs
-- 6. Run this SQL script

-- Alternative: Use Supabase Auth API to create users programmatically
-- But for demo purposes, using the dashboard is simpler