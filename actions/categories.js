"use server";

import { createClient } from "@/utils/supabase/server";

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
    .from("categories")
    .select("*", { count: "exact" })
    .eq("user_id", user.user.id)
    .ilike("name", `%${searchText}%`)
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

export async function getAll() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const res = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.user.id);

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}

export async function create(formData) {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  const res = await supabase
    .from("categories")
    .insert({
      ...formData,
      user_id: user.user.id,
    })
    .select("*");

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}

export async function update(id, formData) {
  const supabase = await createClient();
  const res = await supabase
    .from("categories")
    .update(formData)
    .eq("id", id)
    .select("*");

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}

export async function remove(id) {
  const supabase = await createClient();
  const res = await supabase.from("categories").delete().eq("id", id);

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}
