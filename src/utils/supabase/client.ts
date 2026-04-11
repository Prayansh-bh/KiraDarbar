import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // NUCLEAR SAFETY: Never throw a fatal error. 
  if (!supabaseUrl || !supabaseKey) {
    console.warn('CRITICAL: Supabase URL or Key missing. Database features will be disabled.');
    return null as any;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null as any;
  }
}
