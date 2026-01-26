import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: number } = {};
  try {
    body = await request.json();
  } catch (_) {
    // No body or invalid JSON
  }

  const quizId = body.id;
  if (!quizId || Number.isNaN(Number(quizId))) {
    return NextResponse.json({ error: "Quiz id is required" }, { status: 400 });
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Verify the quiz exists and belongs to the user
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("id, author_email")
      .eq("id", quizId)
      .single();

    if (quizError) {
      const msg = quizError.message || "Failed to fetch quiz";
      const status = msg.includes("No rows") ? 404 : 500;
      return NextResponse.json({ error: msg }, { status });
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.author_email !== user.email) {
      return NextResponse.json(
        { error: "Forbidden: You are not the author of this quiz" },
        { status: 403 },
      );
    }

    // Delete related MCQ options and questions first to satisfy FKs
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from("questions")
      .select("id")
      .eq("quiz_id", quizId);

    if (questionsError) {
      return NextResponse.json(
        { error: questionsError.message },
        { status: 500 },
      );
    }

    const questionIds = (questions ?? []).map((q: { id: number }) => q.id);

    if (questionIds.length > 0) {
      const { error: optionsDeleteError } = await supabaseAdmin
        .from("mcq_options")
        .delete()
        .in("question_id", questionIds);

      if (optionsDeleteError) {
        return NextResponse.json(
          { error: optionsDeleteError.message },
          { status: 500 },
        );
      }
    }

    const { error: questionsDeleteError } = await supabaseAdmin
      .from("questions")
      .delete()
      .eq("quiz_id", quizId);

    if (questionsDeleteError) {
      return NextResponse.json(
        { error: questionsDeleteError.message },
        { status: 500 },
      );
    }

    const { error: quizDeleteError } = await supabaseAdmin
      .from("quizzes")
      .delete()
      .eq("id", quizId)
      .eq("author_email", user.email);

    if (quizDeleteError) {
      return NextResponse.json(
        { error: quizDeleteError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
