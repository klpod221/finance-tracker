"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAll(current = 1) {
  const supabase = await createClient();

  const pageSize = 100;
  const range = (current - 1) * 10;

  const res = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .range(range, range + pageSize - 1);

  if (res.error) {
    throw new Error(res.error.message);
  }

  return {
    data: res.data,
    pagination: {
      current,
      pageSize,
      total: res.count,
    },
  };
}
