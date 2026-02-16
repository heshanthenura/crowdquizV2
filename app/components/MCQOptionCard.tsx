"use client";
import React from "react";
import { MCQQuestionType } from "../types/types";

function MCQOptionCard({
  question,
  qIndex,
  selectedOption,
  onSelect,
}: Readonly<{
  question: MCQQuestionType;
  qIndex: number;
  selectedOption: number | null;
  onSelect: (questionId: number, answerId: number) => void;
}>) {
  console.log("Rendering question", question.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {qIndex + 1}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 mt-2">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = answer.id === selectedOption;

          return (
            <button
              key={answer.id}
              onClick={() => onSelect(question.id, answer.id)}
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
  );
}

export default React.memo(MCQOptionCard);
