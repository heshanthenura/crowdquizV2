import { MCQOptionType, MCQQuizType } from "@/app/types/types";
import { supabaseAdmin } from "@/app/utils/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data: MCQQuizType = await request.json();
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log(user.role);
    const authorEmail = user.email;
    const authorName = user.user_metadata?.full_name || user.email;

    const { data: quizData, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .insert({
        title: data.title,
        description: data.description,
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
        })
        .select();

      if (questionError) throw questionError;

      const questionId = questionData[0].id;

      const optionsData = question.answers.map((answer: MCQOptionType) => ({
        question_id: questionId,
        option: answer.option,
        is_correct: answer.isCorrect,
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
