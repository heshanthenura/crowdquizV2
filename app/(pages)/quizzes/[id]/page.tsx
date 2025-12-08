import NavBar from "@/app/components/NavBar";
import QuizForm from "@/app/components/QuizForm";

export default async function Quiz(
  props: Readonly<{
    params: { id: string } | Promise<{ id: string }>;
  }>
) {
  const params = await props.params;
  const id = params.id;

  return (
    <div>
      <NavBar />
      <QuizForm id={id} />
    </div>
  );
}
