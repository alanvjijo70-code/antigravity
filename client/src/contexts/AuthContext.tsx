import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project')) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  preferred_language?: string;
  state?: string;
  district?: string;
  village?: string;
  farm_name?: string;
  land_area?: number;
  land_unit?: string;
  farming_type?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check local storage for persistent session
    const savedToken = localStorage.getItem('agrisense_token');
    const savedUser = localStorage.getItem('agrisense_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse cached session:', e);
      }
    }

    // 2. If Supabase is configured, listen to auth state changes
    if (supabaseClient) {
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const u: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Farmer',
            phone: session.user.user_metadata?.phone,
            preferred_language: session.user.user_metadata?.preferred_language || 'en',
            state: session.user.user_metadata?.state,
            district: session.user.user_metadata?.district,
          };
          setUser(u);
          setToken(session.access_token);
          localStorage.setItem('agrisense_token', session.access_token);
          localStorage.setItem('agrisense_user', JSON.stringify(u));
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (session) {
          const u: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Farmer',
            phone: session.user.user_metadata?.phone,
            preferred_language: session.user.user_metadata?.preferred_language || 'en',
            state: session.user.user_metadata?.state,
            district: session.user.user_metadata?.district,
          };
          setUser(u);
          setToken(session.access_token);
          localStorage.setItem('agrisense_token', session.access_token);
          localStorage.setItem('agrisense_user', JSON.stringify(u));
        } else if (!localStorage.getItem('agrisense_token')?.startsWith('demo-user-')) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('agrisense_token');
          localStorage.removeItem('agrisense_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) throw error;
        if (data.session) {
          const u: User = {
            id: data.session.user.id,
            email: data.session.user.email || email,
            full_name: data.session.user.user_metadata?.full_name || 'Farmer',
            state: data.session.user.user_metadata?.state,
            district: data.session.user.user_metadata?.district,
          };
          setUser(u);
          setToken(data.session.access_token);
          localStorage.setItem('agrisense_token', data.session.access_token);
          localStorage.setItem('agrisense_user', JSON.stringify(u));
        }
      } else {
        // Fallback local session if Supabase is offline
        const u: User = {
          id: 'local-farmer-01',
          email,
          full_name: email.split('@')[0],
          state: 'Kerala',
          district: 'Palakkad',
        };
        const mockToken = 'demo-user-local-farmer-01';
        setUser(u);
        setToken(mockToken);
        localStorage.setItem('agrisense_token', mockToken);
        localStorage.setItem('agrisense_user', JSON.stringify(u));
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: any) => {
    setLoading(true);
    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
              phone: formData.phone,
              preferred_language: formData.preferred_language || 'en',
              state: formData.state,
              district: formData.district,
              village: formData.village,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          const u: User = {
            id: data.session.user.id,
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            preferred_language: formData.preferred_language || 'en',
            state: formData.state,
            district: formData.district,
            village: formData.village,
          };
          setUser(u);
          setToken(data.session.access_token);
          localStorage.setItem('agrisense_token', data.session.access_token);
          localStorage.setItem('agrisense_user', JSON.stringify(u));
        }
      } else {
        const u: User = {
          id: 'farmer-' + Date.now(),
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          preferred_language: formData.preferred_language || 'en',
          state: formData.state,
          district: formData.district,
          village: formData.village,
        };
        const mockToken = `demo-user-${u.id}`;
        setUser(u);
        setToken(mockToken);
        localStorage.setItem('agrisense_token', mockToken);
        localStorage.setItem('agrisense_user', JSON.stringify(u));
      }
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = () => {
    const demoUser: User = {
      id: 'demo-farmer-kerala',
      email: 'farmer.demo@agrisense.ai',
      full_name: 'Anil Kumar (അനിൽ കുമാർ)',
      phone: '+91 98470 12345',
      preferred_language: 'en',
      state: 'Kerala',
      district: 'Palakkad',
      village: 'Chittur',
      farm_name: 'Green Meadows Organic Farm',
      land_area: 3.5,
      land_unit: 'acre',
      farming_type: 'Integrated Agro-Forestry',
    };
    const demoToken = 'demo-user-demo-farmer-kerala';
    setUser(demoUser);
    setToken(demoToken);
    localStorage.setItem('agrisense_token', demoToken);
    localStorage.setItem('agrisense_user', JSON.stringify(demoUser));
  };

  const logout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrisense_token');
    localStorage.removeItem('agrisense_user');
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const neu = { ...user, ...updated };
      setUser(neu);
      localStorage.setItem('agrisense_user', JSON.stringify(neu));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
