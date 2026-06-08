import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { joinCase } from "./actions";

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: caseData } = await supabase
    .from("cases")
    .select("*, users!cases_user_a_id_fkey(full_name, email)")
    .eq("id", id)
    .single();

  if (!caseData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        <p className="text-slate-500">Expediente no encontrado o el enlace es inválido.</p>
      </div>
    );
  }

  // Si el usuario ya forma parte del caso, al dashboard
  if (user && (caseData.user_a_id === user.id || caseData.user_b_id === user.id)) {
    redirect("/dashboard");
  }

  const inviterName = caseData.users?.full_name || caseData.users?.email || "Tu pareja";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-slate-900">Invitación a MediadoresIA</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            Has sido invitado a participar en un expediente de separación amistosa.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4">
          <p className="mb-8 text-slate-700">
            <span className="font-semibold text-slate-900">{inviterName}</span> ha iniciado un proceso de mediación guiada y te ha invitado a unirte.
          </p>
          
          {!user ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">Inicia sesión para aceptar la invitación y continuar.</p>
              <form action={async () => {
                "use server";
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                cookieStore.set("next_url", `/invite/${id}`);

                const supabaseClient = await createClient();
                const { data } = await supabaseClient.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `http://localhost:3005/auth/callback`,
                  },
                });
                if (data.url) redirect(data.url);
              }}>
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" size="lg">
                  Iniciar sesión para aceptar
                </Button>
              </form>
            </div>
          ) : (
            <form action={joinCase.bind(null, id)}>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                Aceptar Invitación y Unirse
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
