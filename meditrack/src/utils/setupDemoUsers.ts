import { supabase } from './supabase';

// This utility helps set up demo users for testing
// Note: This should only be used in development/demo environments

export const setupDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'admin@meditrack.com',
      password: 'admin123',
      userData: {
        full_name: 'Demo Administrator',
        role: 'admin',
        department: 'Administration',
        phone: '+1-555-0101'
      }
    },
    {
      email: 'superadmin@meditrack.com',
      password: 'superadmin123',
      userData: {
        full_name: 'Demo Super Administrator',
        role: 'superadmin',
        department: 'IT Department',
        phone: '+1-555-0102'
      }
    }
  ];

  console.log('Setting up demo users...');

  for (const user of demoUsers) {
    try {
      // Create auth user with confirmed email
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.userData.full_name
        }
      });

      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError);
        continue;
      }

      if (authData.user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: user.email,
            ...user.userData
          });

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError);
        } else {
          console.log(`✅ Demo user created: ${user.email}`);
        }
      }
    } catch (error) {
      console.error(`Unexpected error creating ${user.email}:`, error);
    }
  }
};

// Instructions for manual setup if the above doesn't work:
export const MANUAL_SETUP_INSTRUCTIONS = `
To manually create demo users with confirmed emails:

1. Go to your Supabase Dashboard -> Authentication -> Users
2. Click "Add User" and create:
   - Email: admin@meditrack.com, Password: admin123
   - Email: superadmin@meditrack.com, Password: superadmin123
   - IMPORTANT: Check "Auto Confirm User" checkbox for both users

3. The profiles will be automatically created via the database trigger.
   If they don't appear, run this SQL in the SQL Editor:

UPDATE profiles SET
  full_name = 'Demo Administrator',
  role = 'admin',
  department = 'Administration',
  phone = '+1-555-0101'
WHERE email = 'admin@meditrack.com';

UPDATE profiles SET
  full_name = 'Demo Super Administrator',
  role = 'superadmin',
  department = 'IT Department',
  phone = '+1-555-0102'
WHERE email = 'superadmin@meditrack.com';

CRITICAL: Make sure to check "Auto Confirm User" when creating the accounts,
otherwise they won't be able to log in!
`;

export default setupDemoUsers;