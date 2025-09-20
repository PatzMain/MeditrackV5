import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { supabase } from '../utils/supabase';
import { Logger } from '../utils/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Get user profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userData: User = {
            id: profile.id,
            username: profile.email,
            full_name: profile.full_name,
            role: profile.role as 'admin' | 'superadmin',
            department: profile.department,
            phone: profile.phone
          };
          setUser(userData);
        }
      }

      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userData: User = {
            id: profile.id,
            username: profile.email,
            full_name: profile.full_name,
            role: profile.role as 'admin' | 'superadmin',
            department: profile.department,
            phone: profile.phone
          };
          setUser(userData);

          // Log successful login
          await Logger.logLogin(session.user.id, {
            email: session.user.email
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        // Log failed login attempt
        await Logger.logFailedLogin(username, error.message);
        throw error;
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        console.log('Profile data from database:', profile);

        if (profile) {
          const userData: User = {
            id: profile.id,
            username: profile.email,
            full_name: profile.full_name,
            role: profile.role as 'admin' | 'superadmin',
            department: profile.department,
            phone: profile.phone
          };
          console.log('User data created:', userData);
          setUser(userData);

          // Log successful login
          await Logger.logLogin(data.user.id, {
            email: data.user.email
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      const currentUserId = user?.id;

      // Log logout before signing out
      if (currentUserId) {
        await Logger.logLogout(currentUserId);
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};