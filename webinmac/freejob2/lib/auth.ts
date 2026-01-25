import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

// TODO: Keep for future Supabase integration
// export async function requireAuth() {
//   const user = await getCurrentUser()
//   
//   if (!user) {
//     redirect('/login')
//   }
//   
//   return user
// }

// TODO: Keep for future Supabase integration
// export async function getUserProfile(userId: string) {
//   const supabase = await createClient()
//   
//   const { data, error } = await supabase
//     .from('users')
//     .select('*')
//     .eq('id', userId)
//     .single()
//
//   if (error) {
//     throw error
//   }
//
//   return data
// }
