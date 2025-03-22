"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAll(page = 1) {
  const supabase = await createClient();

  // 100 notifications per page
  const pageSize = 100;
  const range = (page - 1) * 10;

  return await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .range(range, range + pageSize - 1);
}
