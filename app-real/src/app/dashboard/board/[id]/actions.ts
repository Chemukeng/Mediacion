"use server";

import { createClient } from "@/utils/supabase/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function generateAgreements(caseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  // Verificar que ambos usuarios han terminado la fase 3B
  const { data: caseData } = await supabase.from("cases").select("*").eq("id", caseId).single();
  if (!caseData.phase_3b_submitted_a || !caseData.phase_3b_submitted_b) {
    throw new Error("Ambas partes deben terminar el cuestionario dinámico");
  }

  // Obtener respuestas estáticas
  const { data: staticData } = await supabase.rpc("get_case_static_questionnaires", { p_case_id: caseId });
  // Obtener respuestas dinámicas
  const { data: dynamicData } = await supabase.rpc("get_case_dynamic_questions", { p_case_id: caseId });

  if (!staticData || !dynamicData) throw new Error("Faltan datos");

  const userAData = staticData.find((d: any) => d.user_id === caseData.user_a_id);
  const userBData = staticData.find((d: any) => d.user_id === caseData.user_b_id);

  const userADynamic = dynamicData.filter((d: any) => d.user_id === caseData.user_a_id);
  const userBDynamic = dynamicData.filter((d: any) => d.user_id === caseData.user_b_id);

  const prompt = `
  Eres un mediador legal. Tienes delante los cuestionarios y las respuestas detalladas de dos cónyuges en proceso de divorcio.
  Tu tarea es extraer los temas principales que deben negociarse (Acuerdos) y crear un pequeño resumen neutral sobre la postura de ambos en ese tema.

  Datos de la Parte A:
  - Hijos: ${userAData?.children_details || 'No'}
  - Propiedades: ${userAData?.properties_details || 'No'}
  - Deudas: ${userAData?.debts_details || 'No'}
  - Ingresos: ${userAData?.monthly_income}€
  - Respuestas concretas: ${userADynamic.map((q: any) => q.question_text + " -> " + q.answer_text).join(" | ")}

  Datos de la Parte B:
  - Hijos: ${userBData?.children_details || 'No'}
  - Propiedades: ${userBData?.properties_details || 'No'}
  - Deudas: ${userBData?.debts_details || 'No'}
  - Ingresos: ${userBData?.monthly_income}€
  - Respuestas concretas: ${userBDynamic.map((q: any) => q.question_text + " -> " + q.answer_text).join(" | ")}

  Genera una lista de temas clave a acordar (mínimo 2, máximo 6). 
  Ejemplos de temas: "Vivienda Habitual", "Custodia de los hijos", "Pensión compensatoria", "Reparto de deudas".
  Para cada tema, escribe un "ai_summary" neutral y breve (máximo 3 frases) explicando la postura actual de ambas partes basándote en sus respuestas (ej: "A propone vender la casa, pero B prefiere quedarse a vivir en ella").
  `;

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      agreements: z.array(z.object({
        topic: z.string(),
        ai_summary: z.string()
      }))
    }),
    prompt: prompt,
  });

  const inserts = object.agreements.map(a => ({
    case_id: caseId,
    topic: a.topic,
    ai_summary: a.ai_summary,
    user_a_status: "pending",
    user_b_status: "pending"
  }));

  const { error } = await supabase.from("agreements").insert(inserts);
  if (error) throw new Error("Error insertando acuerdos: " + error.message);
}

export async function updateAgreementStatus(agreementId: string, caseId: string, status: "pending" | "accepted" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: caseData } = await supabase.from("cases").select("*").eq("id", caseId).single();
  const isUserA = caseData.user_a_id === user.id;

  const updatePayload = isUserA ? { user_a_status: status } : { user_b_status: status };

  await supabase.from("agreements").update(updatePayload).eq("id", agreementId);
  revalidatePath(`/dashboard/board/${caseId}`);
}

import Stripe from "stripe";

export async function createCheckoutSession(caseId: string, type: "full" | "half") {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const amount = type === "full" ? 50000 : 25000; // en céntimos

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Resolución de Mediación y Convenio Regulador",
            description: type === "full" ? "Pago completo del expediente legal." : "Pago del 50% de las costas de mediación.",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://fepxgtherpcvxklqnaib.supabase.co", "http://localhost:3005") || "http://localhost:3005"}/dashboard/board/${caseId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://fepxgtherpcvxklqnaib.supabase.co", "http://localhost:3005") || "http://localhost:3005"}/dashboard/board/${caseId}?canceled=true`,
    metadata: {
      caseId,
      type,
      userId: user.id
    }
  });

  return session.url;
}
