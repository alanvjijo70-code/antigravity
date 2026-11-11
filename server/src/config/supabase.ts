import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// User-scoped Supabase client (anon)
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Administrative / Service-Role Supabase client (used strictly for backend system operations)
export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// Helper to create an authenticated Supabase client for a specific user request
export const createUserClient = (accessToken: string) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
