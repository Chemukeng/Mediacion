"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function joinCase(caseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Comprobar el caso
  const { data: caseData, error: fetchError } = await supabase
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .single();

  if (fetchError || !caseData) {
    throw new Error("Expediente no encontrado");
  }

  // Si el usuario ya está dentro, redirigir al dashboard
  if (caseData.user_a_id === user.id || caseData.user_b_id === user.id) {
    redirect("/dashboard");
  }

  // Si el caso ya tiene a alguien más
  if (caseData.user_b_id !== null) {
    throw new Error("El expediente ya tiene a ambas partes asignadas");
  }

  // Unirse al caso
  const { error: updateError } = await supabase
    .from("cases")
    .update({ user_b_id: user.id })
    .eq("id", caseId);

  if (updateError) {
    throw new Error("Error al unirse al expediente");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
