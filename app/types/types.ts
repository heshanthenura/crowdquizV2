export type QuizPreviewCard = {
  id: number;
  title: string;
  description: string;
  quiz_type: string;
  created_at: Date;
  number_of_questions: number;
  time: number;
};

export type QuizListResponse = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  data: QuizPreviewCard[];
  error: string;
};

export type MCQAnswer = {
  text: string;
  isCorrect: boolean;
};

export type MCQQuestion = {
  question: string;
  answers: MCQAnswer[];
};

export type MCQQuiz = {
  id: string;
  created_at: Date;
  title: string;
  description: string;
  number_of_questions: number;
  quiz_type: string;
  time: number;
  author_email: string;
  author_name: string;
  questions: MCQQuestion[];
};
