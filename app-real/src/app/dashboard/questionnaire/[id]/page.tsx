import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StaticForm } from "./components/static-form";
import Link from "next/link";

export default async function QuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: caseData } = await supabase.from("cases").select("*").eq("id", id).single();
  if (!caseData) redirect("/dashboard");

  const isUserA = caseData.user_a_id === user.id;
  const isUserB = caseData.user_b_id === user.id;
  
  if (!isUserA && !isUserB) redirect("/dashboard");

  const mySubmissionStatus = isUserA ? caseData.phase_3a_submitted_a : caseData.phase_3a_submitted_b;

  if (mySubmissionStatus) {
    // Si ya envió el 3A, redirigimos a la fase 3B directamente.
    redirect(`/dashboard/dynamic/${id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans pb-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">
              Fase 3A: Cuestionario Básico
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Tu situación general</h1>
            <p className="text-slate-500 mt-2">
              Responde estas preguntas básicas. Tus respuestas son totalmente confidenciales y la otra parte no las verá.
              En base a esto, nuestra IA generará el siguiente cuestionario a tu medida.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Volver</Link>
          </Button>
        </header>

        <StaticForm caseId={id} />
      </div>
    </div>
  );
}
