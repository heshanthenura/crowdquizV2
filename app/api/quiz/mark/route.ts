import { getMCQQuiz } from "@/app/utils/dbutils";
import { markQuiz } from "@/app/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const quizId = Number(body?.quizId);
  const answers = (body?.answers ?? {}) as Record<number, number>;

  if (!Number.isFinite(quizId)) {
    return NextResponse.json({ error: "Invalid quizId" }, { status: 400 });
  }

  const quiz = await getMCQQuiz(quizId);

  if (quiz.error || !quiz.data) {
    return NextResponse.json(
      { error: quiz.error?.message || "Quiz not found" },
      { status: 404 },
    );
  }

  const result = await markQuiz(quiz.data, answers);
  console.log("Marking result:", result);
  return NextResponse.json({ data: result });
}
