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
    const { case_id, user_id, message } = await req.json();
    if (!case_id || !user_id || !message) {
      throw new Error("case_id, user_id, and message are required");
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Save the User's Message to the DB
    const { error: userMsgError } = await supabase
      .from("assistant_messages")
      .insert({
        case_id,
        user_id,
        role: "user",
        content: message,
      });

    if (userMsgError) {
      throw new Error(`Error saving user message: ${userMsgError.message}`);
    }

    // 3. Fetch recent message history (to maintain context)
    const { data: history, error: historyError } = await supabase
      .from("assistant_messages")
      .select("*")
      .eq("case_id", case_id)
      .eq("user_id", user_id)
      .order("created_at", { ascending: true })
      .limit(15);

    if (historyError) {
      throw new Error(`Error loading history: ${historyError.message}`);
    }

    // System instruction for the IA mediator chatbot
    const systemInstruction = `Eres un asistente de IA especializado en mediación familiar, divorcios amistosos y redacción de convenios reguladores.
Estás conversando con uno de los cónyuges en su Bóveda Privada 100% confidencial.
Tu rol es:
- Escuchar de forma empática y actuar como un espacio seguro para el desahogo emocional.
- Ayudar al cónyuge a estructurar sus propuestas y argumentos para la mesa de negociación.
- Fomentar la neutralidad, el interés superior de los hijos comunes, y soluciones de beneficio mutuo.
- Recordar al usuario que sus comentarios en este chat no serán visibles para el otro cónyuge.
- Responder de forma calmada, constructiva y en un tono profesional pero acogedor.
- Evitar tomar partido o incentivar conflictos adicionales.
- Aclarar que tu soporte es de orientación y no constituye asesoramiento legal vinculante.`;

    // Map history to OpenAI message format
    const messages = history?.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })) || [];

    // Prepend the system prompt as the first message
    messages.unshift({
      role: "system",
      content: systemInstruction,
    });

    // 4. Call OpenAI API
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
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const replyText = result.choices?.[0]?.message?.content;
    if (!replyText) {
      throw new Error("Invalid response from OpenAI API");
    }

    // 5. Save the Assistant's Reply to the DB
    const { data: savedReply, error: assistantMsgError } = await supabase
      .from("assistant_messages")
      .insert({
        case_id,
        user_id,
        role: "assistant",
        content: replyText,
      })
      .select()
      .single();

    if (assistantMsgError) {
      throw new Error(`Error saving assistant reply: ${assistantMsgError.message}`);
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: savedReply,
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
