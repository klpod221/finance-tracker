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
  { categoryId = null, groupId = null } = {},
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

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", user.user.id);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  } else if (groupId) {
    query = query.eq("group_id", groupId);
  }

  if (searchText) {
    query = query.ilike("note", `%${searchText}%`);
  }
    
  const { data, count, error } = await query
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

export async function remove(id) {
  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  const res = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res;
}
