"use server";

import { createClient } from "@/utils/supabase/server";

export async function update(formData) {
  const supabase = await createClient();

  const { data: auth} = await supabase.auth.getUser();

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
