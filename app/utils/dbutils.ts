import { supabase } from "@/app/utils/supabase";
import { MCQQuizType } from "@/app/types/types";

export async function getMCQQuiz(id: number): Promise<{
  data: MCQQuizType | null;
  error: Error | null;
}> {
  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (quizError || !quizData) {
    return { data: null, error: quizError };
  }
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", id);

  if (questionsError || !questions) {
    return { data: null, error: questionsError };
  }

  const questionIds = questions.map((q) => q.id);
  const { data: mcqOptions, error: optionsError } = await supabase
    .from("mcq_options")
    .select("*")
    .in("question_id", questionIds);

  if (optionsError) {
    return { data: null, error: optionsError };
  }

  const questionsWithOptions = questions.map((q) => ({
    id: q.id,
    created_at: q.created_at,
    quiz_id: q.quiz_id,
    type: "MCQ" as const,
    marks: q.marks,
    question: q.question,
    answers: mcqOptions?.filter((opt) => opt.question_id === q.id) || [],
  }));

  const mcqQuiz: MCQQuizType = {
    id: quizData.id.toString(),
    created_at: quizData.created_at,
    title: quizData.title,
    description: quizData.description,
    number_of_questions: quizData.number_of_questions,
    quiz_type: quizData.quiz_type,
    time: quizData.time,
    author_email: "",
    author_name: "",
    questions: questionsWithOptions,
  };

  return { data: mcqQuiz, error: null };
}
