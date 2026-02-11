import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

type UserResult =
  | { user: { email?: string | null } }
  | { response: NextResponse };
type QuizResult =
  | { quiz: { id: number; author_email: string | null } }
  | { response: NextResponse };
type QuestionIdsResult = { questionIds: number[] } | { response: NextResponse };

const jsonError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const getAuthToken = (request: NextRequest) =>
  request.headers.get("authorization")?.split(" ")[1] ?? null;

const parseQuizId = async (request: NextRequest): Promise<number | null> => {
  let body: { id?: number } = {};
  try {
    body = await request.json();
  } catch {
    return null;
  }

  const quizId = body.id;
  if (!quizId || Number.isNaN(Number(quizId))) {
    return null;
  }

  return Number(quizId);
};

const requireUser = async (token: string): Promise<UserResult> => {
  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return { response: jsonError("Invalid token", 401) };
  }

  return { user };
};

const fetchQuiz = async (quizId: number): Promise<QuizResult> => {
  const { data: quiz, error: quizError } = await supabaseAdmin
    .from("quizzes")
    .select("id, author_email")
    .eq("id", quizId)
    .single();

  if (quizError) {
    const msg = quizError.message || "Failed to fetch quiz";
    const status = msg.includes("No rows") ? 404 : 500;
    return { response: jsonError(msg, status) };
  }

  if (!quiz) {
    return { response: jsonError("Quiz not found", 404) };
  }

  return { quiz };
};

const ensureAuthor = (
  quiz: { author_email: string | null },
  user: { email?: string | null },
): NextResponse | null => {
  if (quiz.author_email !== user.email) {
    return jsonError("Forbidden: You are not the author of this quiz", 403);
  }

  return null;
};

const fetchQuestionIds = async (quizId: number): Promise<QuestionIdsResult> => {
  const { data: questions, error: questionsError } = await supabaseAdmin
    .from("questions")
    .select("id")
    .eq("quiz_id", quizId);

  if (questionsError) {
    return { response: jsonError(questionsError.message, 500) };
  }

  const questionIds = (questions ?? []).map((q: { id: number }) => q.id);
  return { questionIds };
};

const deleteOptions = async (questionIds: number[]) => {
  if (questionIds.length === 0) {
    return null;
  }

  const { error: optionsDeleteError } = await supabaseAdmin
    .from("mcq_options")
    .delete()
    .in("question_id", questionIds);

  if (optionsDeleteError) {
    return jsonError(optionsDeleteError.message, 500);
  }

  return null;
};

const deleteQuestions = async (quizId: number) => {
  const { error: questionsDeleteError } = await supabaseAdmin
    .from("questions")
    .delete()
    .eq("quiz_id", quizId);

  if (questionsDeleteError) {
    return jsonError(questionsDeleteError.message, 500);
  }

  return null;
};

const deleteQuiz = async (quizId: number, authorEmail: string | null) => {
  const { error: quizDeleteError } = await supabaseAdmin
    .from("quizzes")
    .delete()
    .eq("id", quizId)
    .eq("author_email", authorEmail);

  if (quizDeleteError) {
    return jsonError(quizDeleteError.message, 500);
  }

  return null;
};

const deleteQuizForUser = async (
  token: string,
  quizId: number,
): Promise<NextResponse> => {
  try {
    const userResult = await requireUser(token);
    if ("response" in userResult) {
      return userResult.response;
    }

    const quizResult = await fetchQuiz(quizId);
    if ("response" in quizResult) {
      return quizResult.response;
    }

    const authorError = ensureAuthor(quizResult.quiz, userResult.user);
    if (authorError) {
      return authorError;
    }

    const questionIdsResult = await fetchQuestionIds(quizId);
    if ("response" in questionIdsResult) {
      return questionIdsResult.response;
    }

    const optionsDeleteError = await deleteOptions(
      questionIdsResult.questionIds,
    );
    if (optionsDeleteError) {
      return optionsDeleteError;
    }

    const questionsDeleteError = await deleteQuestions(quizId);
    if (questionsDeleteError) {
      return questionsDeleteError;
    }

    const quizDeleteError = await deleteQuiz(
      quizId,
      userResult.user.email ?? null,
    );
    if (quizDeleteError) {
      return quizDeleteError;
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return jsonError("Internal server error", 500);
  }
};

export async function DELETE(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token) {
    return jsonError("Unauthorized", 401);
  }

  const quizId = await parseQuizId(request);
  if (quizId === null) {
    return jsonError("Quiz id is required", 400);
  }

  return deleteQuizForUser(token, quizId);
}
