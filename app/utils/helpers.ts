import {
  MCQQuizType,
  QuizListResponseType,
  QuizPreviewCardType,
} from "@/app/types/types";
import validateJSON from "./validateJSON";

type TokenCache = {
  token: string;
  expiresAt: number;
};

let cachedToken: TokenCache | null = null;
let inflightToken: Promise<string | null> | null = null;

const isTokenValid = (tokenInfo: TokenCache | null) => {
  if (!tokenInfo) return false;
  const refreshBufferMs = 60_000;
  return tokenInfo.expiresAt * 1000 - refreshBufferMs > Date.now();
};

export async function getSessionAccessToken(): Promise<string | null> {
  if (isTokenValid(cachedToken)) {
    return cachedToken!.token;
  }

  if (inflightToken) {
    return inflightToken;
  }

  inflightToken = import("@/app/utils/supabase")
    .then((m) => m.supabase.auth.getSession())
    .then(({ data }) => {
      const session = data?.session;
      if (!session?.access_token || !session.expires_at) {
        cachedToken = null;
        return null;
      }

      cachedToken = {
        token: session.access_token,
        expiresAt: session.expires_at,
      };
      return session.access_token;
    })
    .catch(() => null)
    .finally(() => {
      inflightToken = null;
    });

  return inflightToken;
}

export async function getRecentQuizzes() {
  const response = await fetch(origin + "/api/quiz/recent");
  const data = await response.json();
  return data as QuizPreviewCardType[];
}

export async function listQuizzes(
  page: number,
  pageLimit: number,
  query: string,
) {
  const res = await fetch(
    origin + `/api/quiz?page=${page}&limit=${pageLimit}&query=${query}`,
  );
  if (!res.ok) return;
  const json = await res.json();
  return json as QuizListResponseType;
}

export async function createMCQQuiz(params: {
  title: string;
  description: string;
  duration: number;
  json: string;
  token?: string;
}): Promise<{ quizId: string }> {
  const [isValid, , questions] = validateJSON(params.json);
  if (!isValid) {
    throw new Error("Invalid JSON format");
  }

  const newQuiz: MCQQuizType = {
    id: null as unknown as string,
    created_at: null as unknown as Date,
    author_email: null as unknown as string,
    author_name: null as unknown as string,
    title: params.title.trim(),
    description: params.description.trim(),
    number_of_questions: questions?.length ?? 0,
    quiz_type: "MCQ",
    time: params.duration,
    questions: questions ?? [],
  };

  const res = await fetch(origin + `/api/quiz/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify(newQuiz),
  });

  if (res.status !== 200) {
    throw new Error("Failed to create quiz");
  }

  const data = await res.json();
  return data;
}

export async function deleteQuizById(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getSessionAccessToken();

  if (!token) {
    return { ok: false, error: "No auth token found" };
  }

  const response = await fetch("/api/quiz/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    return {
      ok: false,
      error: payload?.error || "Failed to delete quiz",
    };
  }

  return { ok: true };
}
