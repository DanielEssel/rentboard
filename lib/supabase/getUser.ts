import { createServerSupabase } from "./server";

export async function getCurrentUser() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // No session → user not logged in
  if (!session?.user) return null;

  return session.user;
}
