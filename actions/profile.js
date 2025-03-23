"use server";

import { createClient } from "@/utils/supabase/server";

export async function update(formData) {
  const supabase = await createClient();

  // get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // update user profile
  return await supabase
    .from("users")
    .update({
      ...formData,
    })
    .eq("id", user.id);
}
