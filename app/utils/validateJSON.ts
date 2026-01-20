import { MCQQuestionType } from "@/app/types/types";

type RawAnswer = { text: unknown; isCorrect: unknown };
type RawQuestion = { question: unknown; answers: unknown };

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

function isAnswer(obj: unknown): obj is { text: string; isCorrect: boolean } {
  const a = obj as RawAnswer;
  return (
    !!a &&
    typeof a.text === "string" &&
    a.text.trim() !== "" &&
    typeof a.isCorrect === "boolean"
  );
}

function isQuestion(
  obj: unknown,
): obj is { question: string; answers: unknown } {
  const q = obj as RawQuestion;
  return !!q && isNonEmptyString(q.question) && q.answers !== undefined;
}

function validateQuestion(element: unknown): [boolean, string] | null {
  if (!isQuestion(element)) {
    return [false, "Each question must have a non-empty 'question' string."];
  }

  const answersRaw = (element as RawQuestion).answers;
  if (!Array.isArray(answersRaw)) {
    return [false, "Each question must have an 'answers' array."];
  }

  if (answersRaw.length < 2) {
    return [false, "Each question must have at least two answers."];
  }

  let correctCount = 0;
  for (const a of answersRaw) {
    if (!isAnswer(a)) {
      return [false, "Answers must have 'text' and 'isCorrect' (boolean)."];
    }
    if (a.isCorrect) correctCount += 1;
  }

  if (correctCount < 1) {
    return [false, "Each question must have at least one correct answer."];
  }

  return null;
}

export default function validateJSON(
  jsonString: string,
): [boolean, string, MCQQuestionType[]?] {
  if (!jsonString || jsonString.trim() === "") {
    return [false, "JSON input is empty."];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return [false, "Invalid JSON format."];
  }

  if (!Array.isArray(parsed)) {
    return [false, "JSON should be an array of questions."];
  }

  for (const element of parsed as unknown[]) {
    const error = validateQuestion(element);
    if (error) return [false, error[1]];
  }

  return [true, "JSON is valid.", parsed as MCQQuestionType[]];
}
