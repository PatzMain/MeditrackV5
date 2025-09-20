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
        role: 'admin',
        department: 'IT Department',
        phone: '+1-555-0102'
      }
    }
  ];

  console.log('Setting up demo users...');

  for (const user of demoUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
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
To manually create demo users:

1. Go to your Supabase Dashboard -> Authentication -> Users
2. Click "Add User" and create:
   - Email: admin@meditrack.com, Password: admin123
   - Email: superadmin@meditrack.com, Password: superadmin123

3. Note the User IDs and run this SQL in the SQL Editor:

UPDATE profiles SET
  full_name = 'Demo Administrator',
  role = 'admin',
  department = 'Administration',
  phone = '+1-555-0101'
WHERE email = 'admin@meditrack.com';

UPDATE profiles SET
  full_name = 'Demo Super Administrator',
  role = 'admin',
  department = 'IT Department',
  phone = '+1-555-0102'
WHERE email = 'superadmin@meditrack.com';
`;

export default setupDemoUsers;