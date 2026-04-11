import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://jabdlrcvcuopdwlagusr.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYmRscmN2Y3VvcGR3bGFndXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDMxNjAsImV4cCI6MjA5MTA3OTE2MH0.hsmJr1CsnWpz99jgiiYoNUd-c7N0xFMO7fOJdhCI3jk';

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
