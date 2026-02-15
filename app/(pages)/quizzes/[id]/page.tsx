"use client";
import MCQOptionCard from "@/app/components/MCQOptionCard";
import NavBar from "@/app/components/NavBar";
import { useAuth } from "@/app/context/AuthContext";
import { MCQMarkResult, MCQQuizType } from "@/app/types/types";
import { handleFinish } from "@/app/utils/helpers";
import { Clock, FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function QuizPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [quiz, setQuiz] = useState<MCQQuizType | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [markResult, setMarkResult] = useState<MCQMarkResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const resultsRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isQuizStarted) return;
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, timeRemaining]);

  useEffect(() => {
    if (!showResults) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showResults]);

  const handelStartQuiz = () => {
    if (!quiz) return;

    setIsQuizStarted(true);
    setTimeRemaining(Number(quiz.time) * 60);
  };

  const handleAnswerSelect = useCallback(
    (questionId: number, answerId: number) => {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answerId,
      }));
    },
    [],
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (!quiz) return "bg-green-500";
    const percentage = (timeRemaining / (quiz.time * 60)) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

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
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Quiz not found"}
            </h1>
            <button
              onClick={() => router.push("/quizzes")}
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const onFinishClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await handleFinish(Number.parseInt(id), userAnswers);
      setMarkResult(result);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setIsQuizStarted(false);
    setShowResults(false);
    setUserAnswers({});
    setMarkResult(null);
    setTimeRemaining(0);
    setIsSubmitting(false);
  };

  const progress = (getAnsweredCount() / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar />
      <div className="min-h-screen pb-24 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* quiz details */}
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
                <div className="font-semibold text-gray-900">
                  Multiple Choice
                </div>
                <div className="text-sm text-gray-500">Type</div>
              </div>
            </div>
            {!isQuizStarted && !showResults && (
              <button
                onClick={handelStartQuiz}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
              >
                Start Quiz
              </button>
            )}
          </div>

          {/* results */}
          {showResults && (
            <>
              <div
                ref={resultsRef}
                className="bg-white rounded-xl border border-gray-200 p-8 mb-6"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Quiz Complete!
                </h2>

                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {markResult?.scorePercentage ?? 0}%
                  </div>
                  <p className="text-gray-600">
                    You got {markResult?.correctCount ?? 0} out of{" "}
                    {quiz.questions.length} questions correct
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {markResult?.correctCount ?? 0}
                    </div>
                    <div className="text-sm text-green-700">✓ Correct</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-700">
                      {markResult?.wrongCount ?? 0}
                    </div>
                    <div className="text-sm text-red-700">✗ Wrong</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-800">
                      {markResult?.unansweredCount ?? 0}
                    </div>
                    <div className="text-sm text-yellow-800">Unanswered</div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => router.push("/quizzes")}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Quizzes
                  </button>
                  <button
                    onClick={handleRetake}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {quiz.questions.map((question, qIndex) => {
                  const questionResult = markResult?.results.find(
                    (r) => r.questionId === question.id,
                  );
                  const userAnswerId = questionResult?.userAnswerId ?? null;
                  const correctAnswerId =
                    questionResult?.correctAnswerId ??
                    question.answers.find((a) => a.is_correct)?.id ??
                    null;
                  const isUnanswered = userAnswerId === null;

                  return (
                    <div
                      key={question.id}
                      className="bg-white rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          Q{qIndex + 1}
                        </span>
                        <p className="flex-1 text-gray-900">
                          {question.question}
                        </p>
                      </div>

                      <div className="space-y-2 ml-8">
                        {question.answers.map((answer) => {
                          const isUserAnswer = userAnswerId === answer.id;
                          const isCorrect = correctAnswerId === answer.id;

                          let answerClassName: string;
                          let labelText = "";

                          if (isUserAnswer && isCorrect) {
                            answerClassName =
                              "bg-green-50 border-green-300 text-green-900";
                            labelText = "✓ Correct";
                          } else if (isUserAnswer && !isCorrect) {
                            answerClassName =
                              "bg-red-50 border-red-300 text-red-900";
                            labelText = "✗ Your answer";
                          } else if (isUnanswered && isCorrect) {
                            answerClassName =
                              "bg-yellow-50 border-yellow-300 text-yellow-900";
                            labelText = "✓ Correct answer";
                          } else if (isCorrect) {
                            answerClassName =
                              "bg-green-50 border-green-300 text-green-900";
                            labelText = "✓ Correct answer";
                          } else {
                            answerClassName =
                              "bg-gray-50 border-gray-200 text-gray-600";
                          }

                          return (
                            <div
                              key={answer.id}
                              className={`p-3 rounded-lg border text-sm ${answerClassName}`}
                            >
                              {answer.option}
                              {labelText && (
                                <span className="ml-2 font-medium">
                                  {labelText}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => router.push("/quizzes")}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Quizzes
                </button>
                <button
                  onClick={handleRetake}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </>
          )}

          {/* progress bar */}
          {isQuizStarted && !showResults && (
            <div className="sticky top-16 bg-white border border-gray-200 rounded-xl z-40 shadow-sm p-6 mb-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Time Remaining
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${getTimerColor()}`}
                    style={{
                      width: `${(timeRemaining / (quiz.time * 60)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {getAnsweredCount()} / {quiz.questions.length} answered
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* quizzes */}
          {isQuizStarted && !showResults && (
            <div className="space-y-6">
              {quiz.questions.map((question, qIndex) => (
                <MCQOptionCard
                  key={question.id}
                  question={question}
                  qIndex={qIndex}
                  selectedOption={userAnswers[question.id] ?? null}
                  onSelect={handleAnswerSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* finish btn */}
      {isQuizStarted && !showResults && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onFinishClick}
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : `Finish Quiz (${getAnsweredCount()}/${quiz.questions.length} answered)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
