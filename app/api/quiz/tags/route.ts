import { supabase } from "@/app/utils/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("tag")
      .not("tag", "is", null);

    if (error) {
      throw error;
    }

    const tags = Array.from(
      new Set(
        (data ?? [])
          .map((item) => item.tag)
          .filter((tag): tag is string => Boolean(tag?.trim())),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Failed to fetch quiz tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 },
    );
  }
}
