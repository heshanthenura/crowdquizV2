import { MCQOptionType, MCQQuizType } from "@/app/types/types";
import { requireUser } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ("response" in auth) return auth.response;
  const { user } = auth;

  const data: MCQQuizType = await request.json();

  try {
    console.log(user.role);
    const authorEmail = user.email;
    const authorName = user.user_metadata?.full_name || user.email;
    const normalizedTag = data.tag?.trim()
      ? data.tag.trim().toUpperCase()
      : null;

    const { data: quizData, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .insert({
        title: data.title,
        description: data.description,
        tag: normalizedTag,
        number_of_questions: data.number_of_questions,
        quiz_type: data.quiz_type,
        time: data.time,
        author_email: authorEmail || "",
        author_name: authorName || "",
      })
      .select();

    if (quizError) throw quizError;

    const quizId = quizData[0].id;

    for (const question of data.questions) {
      const { data: questionData, error: questionError } = await supabaseAdmin
        .from("questions")
        .insert({
          quiz_id: quizId,
          type: "MCQ",
          question: question.question,
          explanation: question.explanation || null,
        })
        .select();

      if (questionError) throw questionError;

      const questionId = questionData[0].id;

      const optionsData = question.answers.map((answer: MCQOptionType) => ({
        question_id: questionId,
        option: answer.option,
        is_correct: answer.is_correct,
      }));

      const { error: optionsError } = await supabaseAdmin
        .from("mcq_options")
        .insert(optionsData);

      if (optionsError) throw optionsError;
    }

    return NextResponse.json({
      message: "Quiz created successfully",
      quizId: quizId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 },
    );
  }
}
