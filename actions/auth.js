"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(formData);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function changePassword(formData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: formData.password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return true;
}
