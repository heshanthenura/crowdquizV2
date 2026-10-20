import NavBar from "@/app/components/NavBar";
import CopyButton from "@/app/components/CopyButton";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz JSON Format",
  description:
    "How to write the questions JSON for a CrowdQuiz quiz, with a ready-made example and an AI prompt that generates quizzes in the right format.",
  alternates: { canonical: "/docs" },
};

const exampleJSON = `[
  {
    "question": "What is the capital of France?",
    "answers": [
      { "option": "Berlin", "is_correct": false },
      { "option": "Madrid", "is_correct": false },
      { "option": "Paris", "is_correct": true },
      { "option": "Rome", "is_correct": false }
    ],
    "explanation": "Paris is the capital city of France."
  },
  {
    "question": "Which of these are prime numbers?",
    "answers": [
      { "option": "2", "is_correct": true },
      { "option": "9", "is_correct": false },
      { "option": "11", "is_correct": true },
      { "option": "15", "is_correct": false }
    ],
    "explanation": "2 and 11 are prime. 9 = 3 x 3 and 15 = 3 x 5."
  }
]`;

const aiPrompt = `Create a multiple-choice quiz about [TOPIC] with [NUMBER] questions at [DIFFICULTY] difficulty.

Return ONLY a valid JSON array. No markdown, no code fences, no text before or after it.

Each item in the array must look exactly like this:
{
  "question": "The question text",
  "answers": [
    { "option": "Answer text", "is_correct": false },
    { "option": "Answer text", "is_correct": true }
  ],
  "explanation": "One or two sentences explaining the correct answer."
}

Rules:
- "question" and every "option" must be non-empty strings.
- Every question needs at least 2 answers (4 is ideal).
- "is_correct" must be a boolean (true or false), never a string.
- Every question needs at least one answer with "is_correct": true.
- Most questions should have exactly one correct answer.
- For a few questions you may make 2 or more answers correct. Those become "select all that apply" checkbox questions.
- "explanation" is optional but recommended.
- Do not repeat questions, and do not put the correct answer in the same position every time.
- Use plain text only. No trailing commas and no comments, so the JSON parses cleanly.`;

function CodeBlock({
  title,
  text,
  copyLabel,
}: Readonly<{ title: string; text: string; copyLabel: string }>) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <CopyButton text={text} label={copyLabel} />
      </div>
      <pre className="p-4 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap bg-white">
        <code>{text}</code>
      </pre>
    </div>
  );
}

const fields = [
  ["question", "string", "Yes", "Cannot be empty."],
  ["answers", "array", "Yes", "At least 2 answers."],
  ["answers[].option", "string", "Yes", "The answer text. Cannot be empty."],
  [
    "answers[].is_correct",
    "boolean",
    "Yes",
    "true or false, not a string. At least one answer per question must be true.",
  ],
  [
    "explanation",
    "string",
    "No",
    "Shown on the results screen after the quiz.",
  ],
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 space-y-10">
            <header>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Quiz JSON Format
              </h1>
              <p className="text-gray-600">
                When you{" "}
                <Link
                  href="/quizzes/create"
                  className="text-blue-600 hover:underline"
                >
                  create a quiz
                </Link>
                , the questions are pasted in as a JSON array. This page shows
                the format and gives you a prompt to have an AI write it for
                you.
              </p>
            </header>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Fields</h2>
              <p className="text-gray-600">
                The JSON must be an array. Each item is one question:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50 text-left text-gray-700">
                    <tr>
                      <th className="p-3 border-b">Field</th>
                      <th className="p-3 border-b">Type</th>
                      <th className="p-3 border-b">Required</th>
                      <th className="p-3 border-b">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {fields.map(([name, type, required, notes]) => (
                      <tr key={name} className="border-b last:border-b-0">
                        <td className="p-3 font-mono">{name}</td>
                        <td className="p-3">{type}</td>
                        <td className="p-3">{required}</td>
                        <td className="p-3">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Single answer vs. select all that apply
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>One correct answer:</strong> players see circles and
                  can pick one option. It is all or nothing.
                </li>
                <li>
                  <strong>Two or more correct answers:</strong> players see
                  checkboxes and a &quot;Select all that apply&quot; label. Each
                  correct pick earns 1 ÷ (number of correct options) and each
                  wrong pick loses 1 ÷ (number of wrong options). The question
                  score is never below 0 or above 1.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Example</h2>
              <p className="text-gray-600">
                The first question has one correct answer and the second has
                two.
              </p>
              <CodeBlock
                title="questions.json"
                text={exampleJSON}
                copyLabel="Copy JSON"
              />
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Generate it with AI
              </h2>
              <p className="text-gray-600">
                Copy this prompt into ChatGPT, Claude, Gemini or any other AI.
                Replace the <code>[TOPIC]</code>, <code>[NUMBER]</code> and{" "}
                <code>[DIFFICULTY]</code> placeholders, then paste the result
                into the create quiz page. The editor there tells you if the
                JSON is valid.
              </p>
              <CodeBlock
                title="AI prompt"
                text={aiPrompt}
                copyLabel="Copy prompt"
              />
              <p className="text-sm text-gray-500">
                AI can get facts wrong, so check the answers before publishing.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
