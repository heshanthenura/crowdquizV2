import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

  const { data: quizDetails, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (quizError || !quizDetails) {
    return NextResponse.json(
      { error: quizError?.message || "Quiz not found" },
      { status: 400 }
    );
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", id);

  if (questionsError || !questions) {
    return NextResponse.json(
      { error: questionsError?.message || "Questions not found" },
      { status: 400 }
    );
  }

  const { data: mcqOptions } = await supabase
    .from("mcq_options")
    .select("*")
    .in(
      "question_id",
      questions.map((q) => q.id)
    );

  const questionsWithOptions = questions.map((q) => {
    if (q.type === "MCQ") {
      return {
        ...q,
        options: mcqOptions?.filter((opt) => opt.question_id === q.id) || [],
      };
    }
    return q;
  });

  return NextResponse.json(
    { quizDetails, questions: questionsWithOptions },
    { status: 200 }
  );
}
