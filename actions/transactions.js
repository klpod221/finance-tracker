"use server";

import { createClient } from "@/utils/supabase/server";

export async function create(formData) {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  const res = await supabase
    .from("transactions")
    .insert({
      ...formData,
      user_id: user.user.id,
    })
    .single();

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
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
  const { type } = filters;

  let res = {};

  if (type) {
    res = await supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .eq("user_id", user.user.id)
      .in("type", type)
      .order(field || "created_at", { ascending: order === "ascend" })
      .range((current - 1) * pageSize, current * pageSize - 1);
  } else {
    res = await supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .eq("user_id", user.user.id)
      .order(field || "created_at", { ascending: order === "ascend" })
      .range((current - 1) * pageSize, current * pageSize - 1);
  }
  
  const { data, count, error } = res;

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

  const res = await supabase
    .from("transactions")
    .update({
      ...formData,
    })
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}

export async function remove() {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  const res = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", user.user.id);

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}
