import { getPlatformStats } from "@/app/utils/dbutils";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await getPlatformStats();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    data,
  });
}
