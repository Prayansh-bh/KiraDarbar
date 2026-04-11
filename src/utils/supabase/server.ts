import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://jabdlrcvcuopdwlagusr.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYmRscmN2Y3VvcGR3bGFndXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDMxNjAsImV4cCI6MjA5MTA3OTE2MH0.hsmJr1CsnWpz99jgiiYoNUd-c7N0xFMO7fOJdhCI3jk';

  if (!supabaseUrl || !supabaseKey || (supabaseUrl.includes('placeholder') && !process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    throw new Error('Supabase URL and Anon Key are required. Check your .env.local file.');
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
