import { getMCQQuiz } from "@/app/utils/dbutils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data, error } = await getMCQQuiz(Number.parseInt(id));
  const publicData = data
    ? {
        ...data,
        questions: data.questions.map((question) => ({
          ...question,
          answers: question.answers.map(({ is_correct: _isCorrect, ...rest }) =>
            rest,
          ),
        })),
      }
    : null;

  return NextResponse.json({ data: publicData, error });
}
