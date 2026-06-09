import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // 1. Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { case_id } = await req.json();
    if (!case_id) {
      throw new Error("case_id is required");
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Fetch the case details
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("*")
      .eq("id", case_id)
      .single();

    if (caseError || !caseData) {
      throw new Error(`Error fetching case: ${caseError?.message || "Not found"}`);
    }

    // 3. Fetch basic questionnaires submitted for this case
    const { data: questionnaires, error: qError } = await supabase
      .from("questionnaire_basic")
      .select("*")
      .eq("case_id", case_id);

    if (qError) {
      throw new Error(`Error fetching questionnaires: ${qError.message}`);
    }

    // Check if both users have submitted their basic questionnaire
    const userAQuestionnaire = questionnaires?.find((q) => q.user_id === caseData.user_a_id);
    const userBQuestionnaire = questionnaires?.find((q) => q.user_id === caseData.user_b_id);

    if (!userAQuestionnaire || !userBQuestionnaire) {
      return new Response(
        JSON.stringify({
          status: "waiting",
          message: "Esperando a que ambas partes completen el cuestionario básico.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Fetch profile details
    const { data: profileA } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", caseData.user_a_id)
      .single();

    const { data: profileB } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", caseData.user_b_id)
      .single();

    const nameA = profileA?.full_name || "Parte A";
    const nameB = profileB?.full_name || "Parte B";

    // 4. Construct the prompt for OpenAI
    const systemPrompt = `Eres un experto mediador familiar y psicólogo de parejas. Estás guiando a una pareja en proceso de divorcio amistoso para redactar su Convenio Regulador de mutuo acuerdo.
Tu objetivo es analizar los datos iniciales de ambos cónyuges y formular exactamente 3 preguntas personalizadas, reflexivas y constructivas para cada uno de ellos.
Estas preguntas les ayudarán a profundizar en sus necesidades individuales, aclarar discrepancias y proponer soluciones equilibradas para la mesa de negociación.

Reglas para las preguntas:
- Deben ser completamente neutrales, empáticas y orientadas a soluciones viables.
- No deben juzgar, culpar ni avivar rencores del pasado.
- Deben centrarse en los temas críticos que presenten discrepancias o que requieran concreción (custodia, vivienda, deudas, régimen económico o pensiones).
- Deben redactarse en segunda persona, dirigidas directamente a cada cónyuge.

Devuelve la respuesta en un formato JSON estructurado con este esquema exacto:
{
  "user_a_questions": [
    "Primera pregunta personalizada para la Parte A",
    "Segunda pregunta personalizada para la Parte A",
    "Tercera pregunta personalizada para la Parte A"
  ],
  "user_b_questions": [
    "Primera pregunta personalizada para la Parte B",
    "Segunda pregunta personalizada para la Parte B",
    "Tercera pregunta personalizada para la Parte B"
  ]
}`;

    const userPrompt = `Datos recopilados de los cuestionarios básicos:

Parte A (${nameA}):
- Hijos: ${userAQuestionnaire.children_details || "No especificado"}
- Vivienda: ${userAQuestionnaire.properties_details || "No especificado"}
- Deudas y Finanzas: ${userAQuestionnaire.debts_details || "No especificado"}

Parte B (${nameB}):
- Hijos: ${userBQuestionnaire.children_details || "No especificado"}
- Vivienda: ${userBQuestionnaire.properties_details || "No especificado"}
- Deudas y Finanzas: ${userBQuestionnaire.debts_details || "No especificado"}`;

    // 5. Call OpenAI API
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const openaiUrl = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const generatedText = result.choices?.[0]?.message?.content;
    if (!generatedText) {
      throw new Error("Invalid response from OpenAI API");
    }

    // Parse the generated JSON
    const questionsJson = JSON.parse(generatedText.trim());

    // 6. Delete old dynamic questions for this case to avoid duplicates
    await supabase
      .from("questionnaire_dynamic")
      .delete()
      .eq("case_id", case_id);

    // 7. Insert the new dynamic questions
    const insertRows = [];

    if (Array.isArray(questionsJson.user_a_questions)) {
      questionsJson.user_a_questions.forEach((q: string, idx: number) => {
        insertRows.push({
          case_id,
          user_id: caseData.user_a_id,
          question_text: q,
          order_index: idx,
        });
      });
    }

    if (Array.isArray(questionsJson.user_b_questions)) {
      questionsJson.user_b_questions.forEach((q: string, idx: number) => {
        insertRows.push({
          case_id,
          user_id: caseData.user_b_id,
          question_text: q,
          order_index: idx,
        });
      });
    }

    if (insertRows.length > 0) {
      const { error: insertError } = await supabase
        .from("questionnaire_dynamic")
        .insert(insertRows);

      if (insertError) {
        throw new Error(`Error inserting dynamic questions: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Preguntas dinámicas generadas y guardadas correctamente.",
        count: insertRows.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message || "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
