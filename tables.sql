-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.mcq_options (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  question_id bigint NOT NULL,
  option text NOT NULL,
  is_correct boolean NOT NULL,
  CONSTRAINT mcq_options_pkey PRIMARY KEY (id),
  CONSTRAINT mcq_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.questions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  quiz_id bigint NOT NULL,
  type text NOT NULL,
  marks double precision,
  question text NOT NULL,
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id)
);
CREATE TABLE public.quizzes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  number_of_questions smallint NOT NULL,
  quiz_type text NOT NULL,
  time text NOT NULL,
  author_email text NOT NULL,
  author_name text NOT NULL,
  CONSTRAINT quizzes_pkey PRIMARY KEY (id)
);