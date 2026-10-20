"use client";
import React from "react";
import { Check } from "lucide-react";
import { MCQQuestionType } from "../types/types";

function MCQOptionCard({
  question,
  qIndex,
  selectedOptions,
  onSelect,
}: Readonly<{
  question: MCQQuestionType;
  qIndex: number;
  selectedOptions: number[];
  onSelect: (questionId: number, answerId: number, multiple: boolean) => void;
}>) {
  const multiple = question.multiple === true;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {qIndex + 1}
          {multiple && " · Select all that apply"}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 mt-2">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = selectedOptions.includes(answer.id);

          return (
            <button
              key={answer.id}
              onClick={() => onSelect(question.id, answer.id, multiple)}
              role={multiple ? "checkbox" : "radio"}
              aria-checked={isSelected}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center ${
                    multiple ? "rounded-md" : "rounded-full"
                  } ${
                    isSelected
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected &&
                    (multiple ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    ))}
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
