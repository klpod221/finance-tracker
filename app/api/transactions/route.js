import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Hello from the transactions API!",
  });
}

export async function POST(request) {
  // TODO: Thêm logic để thêm giao dịch mới
}
