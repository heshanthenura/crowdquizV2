import { supabase } from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const query = searchParams.get("query") || "";
    const selectedTag = searchParams.get("tag") || "all";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dbQuery = supabase
      .from("quizzes")
      .select(
        "id,title,description,quiz_type,tag,number_of_questions,time, created_at::date",
        { count: "exact" },
      )
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (selectedTag !== "all") {
      dbQuery = dbQuery.eq("tag", selectedTag);
    }

    const { data, error, count } = await dbQuery.range(from, to);

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      page,
      limit,
      totalPages,
      totalCount: count,
      data,
      error,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred", error: (error as Error).message },
      { status: 500 },
    );
  }
}
