import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { generateAgreements } from "./actions";
import { BoardClient } from "./components/board-client";

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: caseData } = await supabase.from("cases").select("*").eq("id", id).single();
  if (!caseData) redirect("/dashboard");

  const isUserA = caseData.user_a_id === user.id;
  const isUserB = caseData.user_b_id === user.id;
  if (!isUserA && !isUserB) redirect("/dashboard");

  if (!caseData.phase_3b_submitted_a || !caseData.phase_3b_submitted_b) {
    redirect(`/dashboard/dynamic/${id}`);
  }

  // Comprobar si existen acuerdos generados
  const { data: agreements } = await supabase.from("agreements").select("*").eq("case_id", id).order("created_at");

  let currentAgreements = agreements || [];

  if (currentAgreements.length === 0) {
    try {
      await generateAgreements(id);
      const { data: newA } = await supabase.from("agreements").select("*").eq("case_id", id).order("created_at");
      currentAgreements = newA || [];
    } catch (e: any) {
      console.error(e);
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="bg-red-50 p-8 rounded-xl text-red-900 border border-red-200">
            Error generando acuerdos: {e.message}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream p-6 font-sans pb-24">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-brand-green"></div>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Expediente Legal #102</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-brand-green">Mapa de Consenso</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Resumen del estado de la mediación
          </p>
        </header>

        <BoardClient 
          caseId={id} 
          agreements={currentAgreements} 
          isUserA={isUserA} 
          caseData={caseData}
        />
      </div>
    </div>
  );
}
