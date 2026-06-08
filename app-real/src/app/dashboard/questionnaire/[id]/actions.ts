"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitStaticQuestionnaire(caseId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const hasChildren = formData.get("has_children") === "true";
  const childrenDetails = formData.get("children_details") as string;
  const hasProperties = formData.get("has_properties") === "true";
  const propertiesDetails = formData.get("properties_details") as string;
  const hasDebts = formData.get("has_debts") === "true";
  const debtsDetails = formData.get("debts_details") as string;
  const monthlyIncome = parseFloat(formData.get("monthly_income") as string || "0");
  const additionalInfo = formData.get("additional_info") as string;

  // 1. Guardar las respuestas
  const { error: insertError } = await supabase.from("static_questionnaires").upsert({
    case_id: caseId,
    user_id: user.id,
    has_children: hasChildren,
    children_details: hasChildren ? childrenDetails : null,
    has_properties: hasProperties,
    properties_details: hasProperties ? propertiesDetails : null,
    has_debts: hasDebts,
    debts_details: hasDebts ? debtsDetails : null,
    monthly_income: monthlyIncome,
    additional_info: additionalInfo
  }, { onConflict: "case_id, user_id" });

  if (insertError) {
    console.error("Error guardando el cuestionario:", insertError);
    throw new Error("No se pudo guardar el cuestionario.");
  }

  // 2. Actualizar el estado del caso
  const { data: caseData } = await supabase.from("cases").select("*").eq("id", caseId).single();
  let updatePayload = {};
  if (caseData.user_a_id === user.id) updatePayload = { phase_3a_submitted_a: true };
  if (caseData.user_b_id === user.id) updatePayload = { phase_3a_submitted_b: true };

  await supabase.from("cases").update(updatePayload).eq("id", caseId);

  // 3. Redirigir a la Fase 3B (Dinámica)
  redirect(`/dashboard/dynamic/${caseId}`);
}
