import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { generateDynamicQuestions } from "./actions";
import { DynamicForm } from "./components/dynamic-form";
import { Button } from "@/components/ui/button";

export default async function DynamicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: caseData } = await supabase.from("cases").select("*").eq("id", id).single();
  if (!caseData) redirect("/dashboard");

  const isUserA = caseData.user_a_id === user.id;
  const mySubmissionStatus3A = isUserA ? caseData.phase_3a_submitted_a : caseData.phase_3a_submitted_b;
  const otherSubmissionStatus3A = isUserA ? caseData.phase_3a_submitted_b : caseData.phase_3a_submitted_a;
  const mySubmissionStatus3B = isUserA ? caseData.phase_3b_submitted_a : caseData.phase_3b_submitted_b;
  const otherSubmissionStatus3B = isUserA ? caseData.phase_3b_submitted_b : caseData.phase_3b_submitted_a;

  if (!mySubmissionStatus3A) {
    redirect(`/dashboard/questionnaire/${id}`);
  }

  // Esperar a que la otra parte termine el cuestionario básico para que la IA pueda cruzar datos
  if (!otherSubmissionStatus3A) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center max-w-lg">
           <h2 className="text-2xl font-semibold text-slate-800 mb-4">Esperando a tu pareja... ⏳</h2>
           <p className="text-slate-600 leading-relaxed">
             Has enviado correctamente tu cuestionario inicial. Ahora estamos esperando a que tu pareja envíe el suyo de forma confidencial.
             En cuanto lo haga, nuestra Inteligencia Artificial analizará y cruzará ambas versiones para generar tus preguntas personalizadas.
           </p>
           <div className="mt-8">
             <Button variant="outline" asChild>
               <a href="/dashboard">Volver al Dashboard</a>
             </Button>
           </div>
        </div>
      </div>
    );
  }

  // Si ambas fases 3B están completas, redirigir a la mesa de mediación
  if (mySubmissionStatus3B && otherSubmissionStatus3B) {
    redirect(`/dashboard/board/${id}`);
  }

  // Obtener preguntas
  const { data: questions } = await supabase
    .from("dynamic_questions")
    .select("*")
    .eq("case_id", id)
    .eq("user_id", user.id)
    .order("created_at");

  // Si no hay preguntas, generarlas
  let currentQuestions = questions || [];
  if (currentQuestions.length === 0) {
    try {
      await generateDynamicQuestions(id);
      const { data: newQ } = await supabase
        .from("dynamic_questions")
        .select("*")
        .eq("case_id", id)
        .eq("user_id", user.id)
        .order("created_at");
      currentQuestions = newQ || [];
    } catch (e: any) {
      console.error(e);
      return (
        <div className="p-8 max-w-2xl mx-auto mt-20 text-center bg-red-50 text-red-900 border border-red-200 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Falta configurar OpenAI</h2>
          <p>La inteligencia artificial necesita tu clave para poder generar las preguntas.</p>
          <p className="mt-4 text-sm font-mono bg-white p-2 rounded">OPENAI_API_KEY=tu_clave_aqui</p>
          <p className="mt-2 text-sm">Añade esa variable en el archivo <strong>.env.local</strong> de tu proyecto y recarga esta página.</p>
          <p className="mt-2 text-xs text-red-400">Error interno: {e.message}</p>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans pb-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
            Fase 3B: Cuestionario Dinámico con IA
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Preguntas personalizadas para ti</h1>
          <p className="text-slate-500 mt-2">
            La inteligencia artificial ha analizado tu situación general y necesita que respondas o detalles algunas cosas concretas. Puedes omitir lo que no quieras responder.
          </p>
        </header>

        {mySubmissionStatus3B ? (
           <div className="mb-8 rounded-xl bg-blue-50 border border-blue-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <h2 className="text-2xl font-medium text-blue-900 mb-2">¡Has enviado todo correctamente!</h2>
            <p className="text-blue-800 text-lg">Estamos esperando a que la otra parte termine su cuestionario para abrir el Tablón de Mediación.</p>
          </div>
        ) : (
          <DynamicForm caseId={id} questions={currentQuestions} />
        )}
      </div>
    </div>
  );
}
