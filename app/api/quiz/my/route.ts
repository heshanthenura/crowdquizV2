import { requireUser } from "@/app/lib/auth";
import { jsonError } from "@/app/lib/http";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ("response" in auth) return auth.response;

  try {
    const { data: quizzes, error: quizzesError } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("author_email", auth.user.email)
      .order("created_at", { ascending: false });

    if (quizzesError) {
      return jsonError(quizzesError.message, 500);
    }

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return jsonError("Internal server error", 500);
  }
}
