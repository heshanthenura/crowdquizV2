"use client";
import NavBar from "@/app/components/NavBar";
import { MCQQuizType } from "@/app/types/types";
import { Clock, FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function QuizPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [quiz, setQuiz] = useState<MCQQuizType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);

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
    if (quiz && quizStarted && !showResults) {
      setTimeRemaining(quiz.time * 60);
    }
  }, [quiz, quizStarted, showResults]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, showResults]);

  const handleStartQuiz = () => {
    if (!quiz) return;
    setQuizStarted(true);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      const correctAnswerIndex = quiz.questions[index].answers.findIndex(
        (a) => a.is_correct,
      );
      if (answer === correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const getAnsweredCount = () => {
    return userAnswers.filter((answer) => answer !== null).length;
  };

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

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="bg-gray-100 min-h-screen">
        <NavBar />
        <div className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Quiz Complete!
              </h2>

              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {percentage}%
                </div>
                <p className="text-gray-600">
                  You got {score} out of {quiz.questions.length} questions
                  correct
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {quiz.questions.map((question, qIndex) => {
                const correctAnswerIndex = question.answers.findIndex(
                  (a) => a.is_correct,
                );
                const isUnanswered = userAnswers[qIndex] === null;

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
                      {question.answers.map((answer, oIndex) => {
                        const isUserAnswer = userAnswers[qIndex] === oIndex;
                        const isCorrect = correctAnswerIndex === oIndex;

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

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/quizzes")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setUserAnswers([]);
                  setShowResults(false);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <NavBar />
        <div className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {quiz.title}
              </h1>
              <p className="text-gray-600 text-lg mb-8">{quiz.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg mb-8">
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

              <button
                onClick={handleStartQuiz}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = (getAnsweredCount() / quiz.questions.length) * 100;

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="min-h-screen pb-24 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

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

          <div className="space-y-6">
            {quiz.questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {qIndex + 1}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900 mt-2">
                    {question.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {question.answers.map((answer, oIndex) => {
                    const isSelected = userAnswers[qIndex] === oIndex;

                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-yellow-500 bg-yellow-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className={isSelected ? "font-medium" : ""}>
                            {answer.option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleFinish}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              Finish Quiz ({getAnsweredCount()}/{quiz.questions.length}{" "}
              answered)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
