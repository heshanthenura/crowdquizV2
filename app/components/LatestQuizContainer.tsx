"use client";
import { useEffect, useState } from "react";
import type { QuizPreviewCardType } from "@/app/types/types";
import QuizPreviewCard from "@/app/components/QuizPreviewCard";

export default function LatestQuizContainer() {
  const [quizzes, setQuizzes] = useState<QuizPreviewCardType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes/latest");
        if (!res.ok) throw new Error("Failed to fetch quizzes");

        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!quizzes || quizzes.length === 0) return <p>No quizzes found</p>;

  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-full max-w-[1400px] px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizPreviewCard key={quiz.id} {...quiz} />
        ))}
      </div>
    </div>
  );
}
