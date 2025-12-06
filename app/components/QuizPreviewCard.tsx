import { QuizPreviewCardType } from "@/app/types/types";
import Link from "next/link";

export default function QuizPreviewCard(quiz: QuizPreviewCardType) {
  return (
    <Link
      href={`/quizzes/${quiz.id}`}
      className="w-full bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-5 border border-gray-100 flex flex-col justify-between h-[230px]"
    >
      <h1 className="text-lg font-bold text-gray-900 line-clamp-1 break-words">
        {quiz.title}
      </h1>

      <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
        {quiz.description}
      </p>

      <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-700">
        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg">
          <span className="font-semibold">{quiz.number_of_questions}</span>
          <span>questions</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg capitalize">
          <span className="font-semibold">{quiz.quiz_type}</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg">
          <span className="font-semibold">{quiz.time} min</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg">
          <span className="text-gray-500">By</span>
          <span className="font-semibold">{quiz.author_name}</span>
        </div>
      </div>
    </Link>
  );
}
