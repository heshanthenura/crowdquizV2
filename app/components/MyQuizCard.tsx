"use client";

import { QuizPreviewCardType } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MyQuizCardProps {
  readonly quiz: QuizPreviewCardType;
  readonly onDelete?: (id: number) => void;
}

export default function MyQuizCard({ quiz, onDelete }: MyQuizCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = () => {
    router.push(`/quizzes/${quiz.id}`);
  };

  const handleEdit = () => {
    router.push(`/quizzes/edit/${quiz.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    setIsDeleting(true);
    onDelete?.(quiz.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{quiz.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Type:</span> {quiz.quiz_type}
        </div>
        <div>
          <span className="font-semibold">Questions:</span>{" "}
          {quiz.number_of_questions}
        </div>
        <div>
          <span className="font-semibold">Time:</span> {quiz.time} mins
        </div>
        <div>
          <span className="font-semibold">Created:</span>{" "}
          {new Date(quiz.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleView}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          View
        </button>
        <button
          onClick={handleEdit}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
