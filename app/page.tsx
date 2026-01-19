import NavBar from "@/app/components/NavBar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <NavBar />
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
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Browse All Quizzes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
