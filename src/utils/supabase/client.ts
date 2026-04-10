import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    if (typeof window === 'undefined') {
      console.warn('Supabase URL or Key missing during build. This is expected if the page is dynamic.');
      return null as any;
    }
    throw new Error('Supabase URL and Anon Key are required. Check your .env.local file.');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
