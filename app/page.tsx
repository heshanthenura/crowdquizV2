"use client";
import NavBar from "@/app/components/NavBar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import QuizPreviewCard from "@/app/components/QuizPreviewCard";
import { type QuizPreviewCardType } from "@/app/types/types";
import { getRecentQuizzes } from "@/app/utils/helpers";
import { getPlatformStats } from "@/app/utils/dbutils";
import { useAuth } from "@/app/context/AuthContext";
import AskLogin from "@/app/components/AskLogin";

export default function Home() {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizPreviewCardType[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
  });
  useEffect(() => {
    const loadData = async () => {
      try {
        const [recentQuizzes, statsResult] = await Promise.all([
          getRecentQuizzes(),
          getPlatformStats(),
        ]);

        setQuizzes(recentQuizzes);
        setStats({
          totalQuizzes: statsResult.data?.quizzes ?? 0,
          totalQuestions: statsResult.data?.questions ?? 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {!user && showLoginPrompt && (
        <AskLogin onClose={() => setShowLoginPrompt(false)} />
      )}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Master Your Skills with CrowdQuiz
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Challenge yourself with our curated collection of quizzes. Track
              your progress and improve your knowledge across various topics.
            </p>
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse All Quizzes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recent Quizzes
              </h2>
              <p className="text-gray-600">Start your learning journey today</p>
            </div>
            <Link
              href="/quizzes"
              className="text-blue-600 hover:text-blue-700 font-bold"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizPreviewCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalQuizzes}
              </div>
              <div className="text-gray-600">Available Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalQuestions}
              </div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
