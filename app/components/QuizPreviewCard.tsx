import { Clock, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function QuizPreviewCard({
  quiz,
}: Readonly<{ quiz: QuizPreviewCard }>) {
  return (
    <Link
      key={quiz.id}
      href={`/quiz/${quiz.id}`}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
          {quiz.quiz_type}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(quiz.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {quiz.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {quiz.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{quiz.time} min</span>
        </div>
        <div className="flex items-center gap-1">
          <FileQuestion className="w-4 h-4" />
          <span>{quiz.number_of_questions} questions</span>
        </div>
      </div>
    </Link>
  );
}
