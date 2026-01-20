"use client";
import NavBar from "@/app/components/NavBar";
import { MCQQuizType } from "@/app/types/types";
import { Clock, FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";

export default function QuizPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const [id, setId] = useState<string>("");
  const [quiz, setQuiz] = useState<MCQQuizType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quiz/${id}`);
        const quizdata = await res.json();

        if (!quizdata.data) {
          setError("Quiz not found");
          return;
        }

        setQuiz(quizdata.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600">{error || "Quiz not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {quiz.title}
          </h1>
          <p className="text-gray-600 text-lg mb-8">{quiz.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">
                {quiz.time} minutes
              </div>
              <div className="text-sm text-gray-500">Duration</div>
            </div>
            <div className="text-center">
              <FileQuestion className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">
                {quiz.number_of_questions}
              </div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                {quiz.quiz_type}
              </div>
              <div className="font-semibold text-gray-900">Multiple Choice</div>
              <div className="text-sm text-gray-500">Type</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Quiz Complete!
          </h2>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{10}%</div>
            <p className="text-gray-600">
              You got {10} out of {quiz.questions.length} questions correct
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
