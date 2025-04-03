import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

import { URL } from "url";

export async function GET() {
  return NextResponse.json({
    message: "Hello from the transactions API!",
  });
}

export async function POST(req) {
  const supabase = await createClient();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const key = url.searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      {
        error: "Key is required",
      },
      { status: 400 }
    );
  }

  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key", key)
    .eq("status", "active")
    .single();
  if (keyError) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching key",
      },
      { status: 500 }
    );
  }

  const { user_id } = keyData;
  const { amount, category_id, note, date } = await req.json();

  if (!amount || !category_id || !note || !date) {
    return NextResponse.json(
      {
        error: "All fields are required",
      },
      { status: 400 }
    );
  }

  // get type from category
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", category_id)
    .single();
  if (categoryError) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching category",
      },
      { status: 500 }
    );
  }

  const { type } = categoryData;
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      amount,
      category_id,
      note,
      date,
      type,
      user_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data,
    message: "Transaction created successfully",
  });
}
