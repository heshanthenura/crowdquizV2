export type QuizPreviewCardType = {
  id: number;
  title: string;
  description: string;
  quiz_type: string;
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
  questions_id: number;
  option: string;
  isCorrect: boolean;
};

export type MCQQuestionType = {
  id: number;
  created_at: Date;
  quiz_id: number;
  type: "MCQ";
  marks: number | null;
  question: string;
  answers: MCQOptionType[];
};

export type MCQQuizType = {
  id: string;
  created_at: Date;
  title: string;
  description: string;
  number_of_questions: number;
  quiz_type: string;
  time: number;
  author_email: string;
  author_name: string;
  questions: MCQQuestionType[];
};
