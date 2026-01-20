"use client";
import NavBar from "@/app/components/NavBar";
import QuizPreviewCard from "@/app/components/QuizPreviewCard";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { type QuizListResponse } from "@/app/types/types";

export default function QuizzesPage() {
  const [data, setData] = useState<QuizListResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 10;

  useEffect(() => {
    const controller = new AbortController();

    const listQuizzes = async (page: number, pageLimit: number) => {
      const res = await fetch(
        `/api/quiz?page=${page}&limit=${pageLimit}&query=${query}`,
        {
          signal: controller.signal,
        },
      );
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    };

    listQuizzes(currentPage, limit);
  }, [currentPage, limit, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Quizzes
            </h1>
            <p className="text-gray-600">
              Explore our complete collection of quizzes
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={query}
                onChange={(e) => {
                  setCurrentPage(1);
                  setQuery(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.data.map((quiz) => (
              <QuizPreviewCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(data.totalPages, p + 1))
                }
                disabled={currentPage === data.totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* <div className="flex items-center justify-center gap-2">
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                true
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              1
            </button>
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
