export type QuizPreviewCardType = {
  id: number;
  title: string;
  description: string;
  quiz_type: string;
  tag?: string | null;
  created_at: Date;
  number_of_questions: number;
  time: number;
};

export type QuizListResponseType = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  data: QuizPreviewCardType[];
  error: string;
};

export type MCQOptionType = {
  id: number;
  created_at: Date;
  question_id: number;
  option: string;
  is_correct: boolean;
};

export type MCQQuestionType = {
  id: number;
  created_at: Date;
  quiz_id: number;
  type: "MCQ";
  marks: number | null;
  question: string;
  answers: MCQOptionType[];
  multiple?: boolean;
  explanation?: string | null;
};

export type MCQQuizType = {
  id: string;
  created_at: Date;
  title: string;
  description: string;
  tag?: string | null;
  number_of_questions: number;
  quiz_type: string;
  time: number;
  author_email: string;
  author_name: string;
  questions: MCQQuestionType[];
};

export type MCQMarkStatus = "correct" | "partial" | "wrong" | "unanswered";

export type MCQMarkAnswerResult = {
  questionId: number;
  correctAnswerIds: number[];
  userAnswerIds: number[];
  status: MCQMarkStatus;
  score: number;
  explanation?: string | null;
};

export type MCQMarkResult = {
  quizId: number;
  userId?: string | null;
  totalQuestions: number;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
  unansweredCount: number;
  earnedScore: number;
  scorePercentage: number;
  timeSpentSeconds?: number | null;
  results: MCQMarkAnswerResult[];
};
