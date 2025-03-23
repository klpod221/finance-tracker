"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();
  return await supabase.auth.signInWithPassword(formData);
}

export async function logout() {
  const supabase = await createClient();
  return await supabase.auth.signOut();
}

export async function changePassword(formData) {
  const supabase = await createClient();
  return await supabase.auth.updateUser({ password: formData.password });
}
