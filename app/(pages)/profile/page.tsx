"use client";
import NavBar from "@/app/components/NavBar";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import MyQuizCard from "@/app/components/MyQuizCard";
import { QuizPreviewCardType } from "@/app/types/types";
import { deleteQuizById, getSessionAccessToken } from "@/app/utils/helpers";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizPreviewCardType[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"quizzes" | "progress">("quizzes");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/unauthenticated");
    }
    console.log("User in ProfilePage:", user);
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !loading && !quizzes.length) {
      fetchMyQuizzes();
    }
  }, [user, loading]);

  const fetchMyQuizzes = async () => {
    setQuizzesLoading(true);
    try {
      const token = await getSessionAccessToken();

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
    deleteQuiz(id);
  };

  const deleteQuiz = async (id: number) => {
    setError(null);
    try {
      const result = await deleteQuizById(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError("Error deleting quiz");
      console.error(err);
    }
  };

  const renderQuizzesSection = () => {
    if (quizzesLoading) {
      return (
        <div className="text-center py-8 text-gray-600">
          Loading your quizzes...
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">
            {`You haven't created any quizzes yet.`}
          </p>
          <button
            onClick={() => router.push("/quizzes/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Create Your First Quiz
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <MyQuizCard key={quiz.id} quiz={quiz} onDelete={handleDeleteQuiz} />
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  console.log(user);
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col gap-[10px]">
      <NavBar />
      <div className="max-w-7xl w-screen mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-[10px] ">
        <div className="bg-white w-full rounded-xl flex flex-col md:flex-row justify-between items-center p-[20px] gap-[10px]">
          <div>
            <Image
              className="rounded-lg"
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
              width={100}
              height={100}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl text-[30px] font-extrabold text-gray-800">
              {user.user_metadata.full_name}
            </h1>
            <div>
              <p className="text-blue-600">{user.email}</p>
              <p className="text-gray-600">
                {"Learning Since "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b-[1px] border-gray-300 w-full flex font-bold gap-[10px]">
          <button
            className={`border-b-2 ${activeTab === "quizzes" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600"}`}
            onClick={() => setActiveTab("quizzes")}
          >
            My Quizzes
          </button>
          <button
            className={`border-b-2 ${activeTab === "progress" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600"}`}
            onClick={() => setActiveTab("progress")}
          >
            My Progress
          </button>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">My Quizzes</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {renderQuizzesSection()}
        </div>
      </div>
    </div>
  );
}
