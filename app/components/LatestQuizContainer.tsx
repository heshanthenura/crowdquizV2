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

  if (loading) {
    return (
      <div className="w-full flex justify-center py-6">
        <div className="w-full max-w-[1400px] px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full h-[230px] bg-gray-200 animate-pulse rounded-xl p-5 flex flex-col gap-4"
            >
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-300 rounded"></div>

              <div className="flex gap-3 mt-auto">
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
