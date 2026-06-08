import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCase } from "./actions";
import { CopyInviteButton } from "./components/copy-invite-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.email;

  // Fetch all active cases
  const { data: activeCases } = await supabase
    .from("cases")
    .select("*")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .neq("status", "completed")
    .order("created_at", { ascending: false });

  // Priorizar el expediente donde ambas partes han accedido (user_b_id no es null)
  let activeCase = null;
  if (activeCases && activeCases.length > 0) {
    activeCase = activeCases.find(c => c.user_b_id !== null) || activeCases[0];
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <form action="/auth/signout" method="post">
            <Button variant="outline">Cerrar sesión</Button>
          </form>
        </header>
        
        <div className="grid gap-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-slate-800">Bienvenido, {displayName}</CardTitle>
              <CardDescription>Aquí puedes gestionar tu expediente de mediación.</CardDescription>
            </CardHeader>
            <CardContent>
              {!activeCase ? (
                <form action={createCase}>
                  <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Crear nuevo expediente
                  </Button>
                </form>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Tu Expediente Activo</CardTitle>
                    <CardDescription>ID: {activeCase.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!activeCase.user_b_id ? (
                      <div className="space-y-4">
                        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                          <p className="text-sm text-yellow-800 font-medium">
                            Esperando a que la otra parte se una.
                          </p>
                        </div>
                        <CopyInviteButton caseId={activeCase.id} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-md bg-green-50 p-4 border border-green-200">
                          <p className="text-sm text-green-800 font-medium">
                            Ambas partes han accedido.
                          </p>
                        </div>

                        {(() => {
                          const isUserA = activeCase.user_a_id === user.id;
                          const my3A = isUserA ? activeCase.phase_3a_submitted_a : activeCase.phase_3a_submitted_b;
                          const my3B = isUserA ? activeCase.phase_3b_submitted_a : activeCase.phase_3b_submitted_b;
                          const other3B = isUserA ? activeCase.phase_3b_submitted_b : activeCase.phase_3b_submitted_a;

                          if (my3B && other3B) {
                            return (
                              <Link href={`/dashboard/board/${activeCase.id}`} className="block">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                                  Ir al Tablón de Mediación
                                </Button>
                              </Link>
                            );
                          }

                          if (my3A) {
                            return (
                              <Link href={`/dashboard/dynamic/${activeCase.id}`} className="block">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                                  Continuar Fase Dinámica
                                </Button>
                              </Link>
                            );
                          }

                          return (
                            <Link href={`/dashboard/questionnaire/${activeCase.id}`} className="block">
                              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white w-full">
                                Ir al Cuestionario Inicial
                              </Button>
                            </Link>
                          );
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
