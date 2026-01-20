import {
  MCQQuizType,
  QuizListResponseType,
  QuizPreviewCardType,
} from "@/app/types/types";
import validateJSON from "./validateJSON";

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
