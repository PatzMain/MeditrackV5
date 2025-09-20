-- Add superadmin role to the user_role enum
-- Run this in your Supabase SQL Editor

-- Add superadmin to the user_role enum
ALTER TYPE user_role ADD VALUE 'superadmin';

-- Update any existing admin users to superadmin if needed
-- UPDATE profiles SET role = 'superadmin' WHERE email = 'superadmin@meditrack.com';

-- Verify the enum now includes superadmin
-- SELECT unnest(enum_range(NULL::user_role));