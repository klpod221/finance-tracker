"use server";

import { createClient } from "@/utils/supabase/server";

export async function update(formData) {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw new Error(authError.message);
  }

  const res = await supabase
    .from("users")
    .upsert({
      id: auth.user.id,
      ...formData,
    })
    .select("*");

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}
