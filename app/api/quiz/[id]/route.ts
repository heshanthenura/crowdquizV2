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
          answers: question.answers.map((answer) => {
            return {
              id: answer.id,
              created_at: answer.created_at,
              question_id: answer.question_id,
              option: answer.option,
            };
          }),
        })),
      }
    : null;

  return NextResponse.json({ data: publicData, error });
}
