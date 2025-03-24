"use server";

import { createClient } from "@/utils/supabase/server";

export async function create(formData) {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  return await supabase
    .from("transactions")
    .insert({
      ...formData,
      user_id: user.user.id,
    })
    .single();
}

export async function search(
  pagination,
  sorter = {},
  searchText = "",
  filters = {}
) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const { current, pageSize } = pagination;
  const { field, order } = sorter;

  const { data, count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", user.user.id)
    .ilike("note", `%${searchText}%`)
    .order(field || "created_at", { ascending: order === "ascend" })
    .range((current - 1) * pageSize, current * pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data,
    pagination: {
      ...pagination,
      total: count,
    },
  };
}

export async function update(id, formData) {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  return await supabase
    .from("transactions")
    .update({
      ...formData,
    })
    .eq("id", id)
    .eq("user_id", user.user.id);
}

export async function remove() {}
