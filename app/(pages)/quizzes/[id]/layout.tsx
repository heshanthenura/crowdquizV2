import type { Metadata } from "next";
import { supabase } from "@/app/utils/supabase";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>): Promise<Metadata> {
  const { id } = await params;
  const quizId = Number.parseInt(id);
  if (Number.isNaN(quizId)) return { robots: { index: false } };

  const { data } = await supabase
    .from("quizzes")
    .select("title, description, number_of_questions")
    .eq("id", quizId)
    .single();

  if (!data) return { title: "Quiz not found", robots: { index: false } };

  const description =
    data.description ||
    `Take the ${data.title} quiz (${data.number_of_questions} questions) on CrowdQuiz.`;

  return {
    title: data.title,
    description,
    alternates: { canonical: `/quizzes/${quizId}` },
    openGraph: {
      type: "article",
      title: data.title,
      description,
      url: `/quizzes/${quizId}`,
    },
    twitter: { title: data.title, description },
  };
}

export default function QuizLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
