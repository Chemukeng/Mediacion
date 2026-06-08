"use server";

import { createClient } from "@/utils/supabase/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function generateDynamicQuestions(caseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  // Obtener respuestas estáticas de AMBOS usuarios usando una función RPC que se salta RLS de forma segura
  const { data: allStaticData, error } = await supabase
    .rpc("get_case_static_questionnaires", { p_case_id: caseId });

  if (error || !allStaticData || allStaticData.length < 2) {
    console.error("Error fetching static data:", error);
    throw new Error("Aún no están ambas respuestas estáticas");
  }

  const myData = allStaticData.find(d => d.user_id === user.id);
  const otherData = allStaticData.find(d => d.user_id !== user.id);

  if (!myData || !otherData) throw new Error("Faltan datos de alguno de los usuarios");

  // Prompt para OpenAI cruzando datos
  const prompt = `
  Eres un mediador legal experto en divorcios. Tu tarea es generar preguntas muy específicas para el USUARIO 1 (con quien hablas), cruzando su cuestionario inicial con el de su pareja (USUARIO 2).
  
  Respuestas del USUARIO 1 (quien va a responder ahora):
  - Hijos en común: ${myData.has_children ? 'Sí. Detalles: ' + myData.children_details : 'No.'}
  - Propiedades: ${myData.has_properties ? 'Sí. Detalles: ' + myData.properties_details : 'No.'}
  - Deudas: ${myData.has_debts ? 'Sí. Detalles: ' + myData.debts_details : 'No.'}
  - Ingresos mensuales declarados: ${myData.monthly_income}€.
  - Información adicional: ${myData.additional_info || "Ninguna"}

  Respuestas de su PAREJA (USUARIO 2):
  - Hijos en común: ${otherData.has_children ? 'Sí. Detalles: ' + otherData.children_details : 'No.'}
  - Propiedades: ${otherData.has_properties ? 'Sí. Detalles: ' + otherData.properties_details : 'No.'}
  - Deudas: ${otherData.has_debts ? 'Sí. Detalles: ' + otherData.debts_details : 'No.'}
  - Ingresos mensuales declarados: ${otherData.monthly_income}€.
  - Información adicional: ${otherData.additional_info || "Ninguna"}

  Busca posibles discrepancias o temas clave (por ejemplo, si uno menciona una deuda y el otro no, o si hay gran diferencia de ingresos).
  Genera TODAS las preguntas que consideres necesarias y fundamentales para el USUARIO 1. No te dejes nada en el tintero si ves discrepancias importantes, porque de estas preguntas dependerá que haya un buen acuerdo en la mesa de mediación.
  
  REGLA MUY IMPORTANTE: Asegúrate de que TODAS las preguntas sean completamente DISTINTAS entre sí. NO repitas la misma pregunta con otras palabras. Si hay varios temas relacionados con la misma cosa, agrúpalos en una sola pregunta.
  
  Ejemplos: "¿Tu pareja indica que no hay propiedades, pero tú mencionaste una vivienda. ¿A nombre de quién está escriturada?"
  Haz que las preguntas sean directas, empáticas y háblale de "tú".
  `;

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      questions: z.array(z.object({
        text: z.string()
      }))
    }),
    prompt: prompt,
  });

  // Insertar en la BD
  const inserts = object.questions.map(q => ({
    case_id: caseId,
    user_id: user.id,
    question_text: q.text
  }));

  await supabase.from("dynamic_questions").insert(inserts);
}

export async function saveDynamicAnswers(caseId: string, answers: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  // Actualizar cada pregunta
  for (const [questionId, answer] of Object.entries(answers)) {
    if (answer === "SKIPPED") {
       await supabase.from("dynamic_questions").update({ is_skipped: true }).eq("id", questionId).eq("user_id", user.id);
    } else {
       await supabase.from("dynamic_questions").update({ answer_text: answer }).eq("id", questionId).eq("user_id", user.id);
    }
  }

  // Marcar fase 3B como completada
  const { data: caseData } = await supabase.from("cases").select("*").eq("id", caseId).single();
  let updatePayload = {};
  if (caseData.user_a_id === user.id) updatePayload = { phase_3b_submitted_a: true };
  if (caseData.user_b_id === user.id) updatePayload = { phase_3b_submitted_b: true };

  await supabase.from("cases").update(updatePayload).eq("id", caseId);

  revalidatePath(`/dashboard/dynamic/${caseId}`);
}
