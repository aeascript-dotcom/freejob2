import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

/**
 * Check if current user is admin
 * Returns the user profile if admin, otherwise redirects
 */
export async function requireAdmin() {
  const supabase = await createClient()
  
  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    redirect('/login')
  }

  // Check if admin
  if (profile.role !== 'admin') {
    redirect('/')
  }

  return profile
}

// TODO: Keep for future Supabase integration
// /**
//  * Get current user profile (for admin pages)
//  */
// export async function getAdminProfile() {
//   const supabase = await createClient()
//   
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//
//   if (!user) {
//     return null
//   }
//
//   const { data: profile } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', user.id)
//     .single()
//
//   return profile
// }
