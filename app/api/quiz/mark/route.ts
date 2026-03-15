import { getMCQQuiz } from "@/app/utils/dbutils";
import { markQuiz } from "@/app/utils/helpers";
import { decrypt } from "@/app/utils/crypto";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const getVerifiedUserId = async (
  request: NextRequest,
): Promise<string | null> => {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
};

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

  const userId = await getVerifiedUserId(request);
  const result = await markQuiz(quiz.data, answers, body?.attemptToken, userId);

  if (userId && body?.attemptToken) {
    try {
      const startMs = Number.parseInt(decrypt(body.attemptToken), 10);
      const timeSpentSeconds = Number.isFinite(startMs)
        ? Math.max(0, Math.round((Date.now() - startMs) / 1000))
        : null;

      if (Number.isFinite(startMs) && timeSpentSeconds !== null) {
        const { error } = await supabaseAdmin.from("attempts").insert({
          user_id: userId,
          quiz_id: quizId,
          correct_count: result.correctCount,
          wrong_count: result.wrongCount,
          unanswere_count: result.unansweredCount,
          time_spent_seconds: timeSpentSeconds,
          started_at: startMs,
        });

        if (error) {
          console.error("Failed to insert attempt history", error);
        }
      }
    } catch (err) {
      console.error("Failed to decode attempt token", err);
    }
  }
  return NextResponse.json({ data: result });
}
