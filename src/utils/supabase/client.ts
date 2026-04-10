import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // NUCLEAR SAFETY: Never throw a fatal error. 
  // If keys are missing, return null and log a warning.
  // This prevents the "Something went wrong" White Screen of Death.
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.warn('CRITICAL: Supabase URL or Key missing. Database features will be disabled.');
    
    // During build or browser runtime, we return null.
    // The components must check if (supabase) before calling methods.
    return null as any;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null as any;
  }
}
