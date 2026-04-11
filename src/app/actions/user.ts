'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeUserProfile({
  userId,
  fullName,
  city,
  state,
}: {
  userId: string
  fullName: string
  city: string
  state: string
}) {
  const supabase = await createClient()

  // Verify the session if available, but allow the provided userId 
  // if the session belongs to that user.
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.id !== userId) {
    // If we're on the server and there's no session, we might be in the 
    // "just signed up, email not confirmed" state.
    // However, without a session, we can't securely update the profile 
    // unlessเรา use the service role, which is risky.
    
    // For now, we'll enforce that the user must be logged in.
    // If they just signed up and email confirmation is ON, 
    // we should tell them to confirm email first.
    if (!user) {
      return { error: 'Authentication required. Please log in or confirm your email.' }
    }
    return { error: 'Unauthorized profile update.' }
  }

  const { error } = await supabase.from('users').upsert({
    id: userId,
    full_name: fullName,
    city,
    state,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
