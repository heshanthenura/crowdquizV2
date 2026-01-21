import { getMCQQuiz } from "@/app/utils/dbutils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data, error } = await getMCQQuiz(Number.parseInt(id));
  return NextResponse.json({ data, error });
}
