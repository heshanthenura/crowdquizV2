"use client";
import NavBar from "@/app/components/NavBar";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import MyQuizCard from "@/app/components/MyQuizCard";
import { QuizPreviewCardType } from "@/app/types/types";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizPreviewCardType[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/unauthenticated");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !loading) {
      fetchMyQuizzes();
    }
  }, [user, loading]);

  const fetchMyQuizzes = async () => {
    setQuizzesLoading(true);
    try {
      const { data: sessionData } = await import("@/app/utils/supabase").then(
        (m) => m.supabase.auth.getSession(),
      );
      const token = sessionData?.session?.access_token;

      if (!token) {
        setError("No auth token found");
        return;
      }

      const response = await fetch("/api/quiz/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to fetch quizzes");
        return;
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError("Error fetching quizzes");
      console.error(err);
    } finally {
      setQuizzesLoading(false);
    }
  };

  const handleDeleteQuiz = (id: number) => {
    // Delete logic will be implemented
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  console.log(user);
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <NavBar />
      <div className="p-8 max-w-7xl mx-auto w-full">
        {/* Profile Card */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="mb-6">
              {user.user_metadata?.picture && (
                <Image
                  src={user.user_metadata.picture}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover"
                />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome,{" "}
              {user.user_metadata?.full_name || user.email?.split("@")[0]}!
            </h1>
            <p className="text-gray-600">
              {user.user_metadata?.full_name && (
                <span className="block text-lg">{user.email}</span>
              )}
            </p>
          </div>
        </div>

        {/* My Quizzes Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">My Quizzes</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {quizzesLoading ? (
            <div className="text-center py-8 text-gray-600">
              Loading your quizzes...
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">
                You haven't created any quizzes yet.
              </p>
              <button
                onClick={() => router.push("/quizzes/create")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <MyQuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onDelete={handleDeleteQuiz}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
