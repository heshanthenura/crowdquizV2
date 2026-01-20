"use client";
import NavBar from "@/app/components/NavBar";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/utils/supabase";
import validateJSON from "@/app/utils/validateJSON";
import { createMCQQuiz } from "@/app/utils/helpers";
import { Facebook, LinkIcon, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddQuizzesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [json, setJson] = useState("");
  const [validation, setValidation] = useState<{
    status: "idle" | "valid" | "invalid";
    questionCount?: number;
    errorMessage?: string;
  }>({ status: "idle" });
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    duration: false,
    json: false,
  });

  const placeholderJSON = `[{
    "question": "What is the capital of France?",
    "answers":[
      { "option": "Berlin", "isCorrect": false },
      { "option": "Madrid", "isCorrect": false },
      { "option": "Paris", "isCorrect": true },
      { "option": "Rome", "isCorrect": false }
    ]
  }]`;

  const getValidMessage = (count?: number) => {
    const plural = count === 1 ? "" : "s";
    return `✓ Valid JSON - ${count ?? 0} question${plural}`;
  };

  useEffect(() => {
    queueMicrotask(() => {
      if (!json.trim()) {
        setValidation({ status: "idle" });
        return;
      }

      const [isValid, message, data] = validateJSON(json);

      if (isValid) {
        setValidation({ status: "valid", questionCount: data?.length });
      } else {
        setValidation({ status: "invalid", errorMessage: message });
      }
    });
  }, [json]);

  const createQuiz = async () => {
    const titleInput = (document.getElementById("title") as HTMLInputElement)
      ?.value;
    const descInput = (
      document.getElementById("description") as HTMLTextAreaElement
    )?.value;
    const durationInput = Number(
      (document.getElementById("duration") as HTMLInputElement)?.value,
    );
    const newErrors = {
      title: !titleInput?.trim(),
      description: !descInput?.trim(),
      duration: !durationInput || durationInput <= 0,
      json: !json.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const data = await createMCQQuiz({
        title: titleInput,
        description: descInput,
        duration: durationInput,
        json,
        token,
      });

      router.push(origin + `/quizzes/` + data.quizId);
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
      setErrors((prev) => ({ ...prev, json: true }));
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/unauthenticated");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="bg-gray-100 flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create New Quiz
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create a new MCQ quiz
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="space-y-6 mb-8">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quiz Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter quiz title"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  onChange={() =>
                    setErrors((prev) => ({ ...prev, title: false }))
                  }
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">Title is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Enter quiz description"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  onChange={() =>
                    setErrors((prev) => ({ ...prev, description: false }))
                  }
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    Description is required
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Duration (minutes) *
                </label>
                <input
                  id="duration"
                  type="number"
                  placeholder="15"
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.duration
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  onChange={() =>
                    setErrors((prev) => ({ ...prev, duration: false }))
                  }
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">
                    Duration is required
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="block text-sm font-medium text-gray-700 mb-3">
                Quiz Type
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="radio"
                    id="mcq"
                    name="type"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="mcq"
                    className="flex items-center justify-center p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer"
                  >
                    <span className="font-medium text-blue-700">MCQ</span>
                  </label>
                </div>
                <div className="relative opacity-50 cursor-not-allowed">
                  <div className="flex items-center justify-center p-4 border-2 border-gray-300 bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-500">
                      True/False (Disabled)
                    </span>
                  </div>
                </div>
                <div className="relative opacity-50 cursor-not-allowed">
                  <div className="flex items-center justify-center p-4 border-2 border-gray-300 bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-500">
                      Fill in Blank (Disabled)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="json"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Questions JSON *
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Paste your questions in JSON format. Each question should have:
                question, options (array), and correctAnswer (index).
              </p>
              <textarea
                placeholder={placeholderJSON}
                id="json"
                rows={12}
                onChange={(e) => {
                  setJson(e.target.value);
                  setErrors((prev) => ({ ...prev, json: false }));
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm ${
                  errors.json
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              {errors.json && (
                <p className="mt-1 text-sm text-red-600">
                  Valid questions JSON is required
                </p>
              )}

              {validation.status !== "idle" && (
                <div
                  className={`mt-3 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                    validation.status === "valid"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        validation.status === "valid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        validation.status === "valid"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {validation.status === "valid"
                        ? getValidMessage(validation.questionCount)
                        : `✗ ${validation.errorMessage}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="block text-sm font-medium text-gray-700 mb-3">
                Share Options (Optional)
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Copy Link</span>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={createQuiz}
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
