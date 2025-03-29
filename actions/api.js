"use server";

import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function search(pagination, sorter = {}, searchText = "", filters = {}) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const { current, pageSize } = pagination;
  const { field, order } = sorter;

  const { data, count, error } = await supabase
    .from("api_keys")
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

export async function create(formData) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const key = crypto.randomBytes(32).toString("hex");

  const { error } = await supabase
    .from("api_keys")
    .insert({
      ...formData,
      key,
      user_id: user.user.id,
    })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function update(id, formData) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const { error } = await supabase
    .from("api_keys")
    .update(formData)
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function remove(id) {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function changeStatus(formData) {
  const { id, status } = formData;

  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }

  const { error } = await supabase
    .from("api_keys")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
