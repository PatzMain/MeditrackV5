import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://eunjsfkyyhlcxplhhxyk.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bmpzZmt5eWhsY3hwbGhoeHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTM2MjUsImV4cCI6MjA3MzkyOTYyNX0.o1UNudsnkvUwM8ClLUg-HjQUN5Qsui4IM62sFeeR5Xc';

const supabase = createClient(supabaseUrl, supabaseKey);

// User data - in production this would be in Supabase database
const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this would be hashed
    full_name: 'System Administrator',
    role: 'admin',
    department: 'IT',
    phone: '+1-555-0001'
  },
  {
    id: '2',
    username: 'superadmin',
    password: 'superadmin123', // In production, this would be hashed
    full_name: 'Super Administrator',
    role: 'superadmin',
    department: 'Management',
    phone: '+1-555-0002'
  }
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in our mock database
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Use Supabase to sign in (this creates a real JWT)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@meditrack.local`, // Create a mock email for Supabase
      password: password
    });

    if (error) {
      // If user doesn't exist in Supabase, create them
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${username}@meditrack.local`,
        password: password,
        options: {
          data: {
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            phone: user.phone
          }
        }
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        // Fallback to manual JWT if Supabase fails
        const token = `meditrack_${user.id}_${Date.now()}`;
        return res.json({
          user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            phone: user.phone
          },
          token: token
        });
      }

      // Return the newly created user
      return res.json({
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          department: user.department,
          phone: user.phone
        },
        token: signUpData.session?.access_token || `meditrack_${user.id}_${Date.now()}`
      });
    }

    // Return successful login with Supabase JWT
    res.json({
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        phone: user.phone
      },
      token: data.session?.access_token || `meditrack_${user.id}_${Date.now()}`
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}