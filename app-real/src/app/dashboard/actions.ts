"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCase() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Verificar si el usuario ya tiene un expediente activo
  const { data: existingCases } = await supabase
    .from("cases")
    .select("id")
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .neq("status", "completed");

  if (existingCases && existingCases.length > 0) {
    throw new Error("Ya tienes un expediente activo");
  }

  // Crear el expediente
  const { data, error } = await supabase
    .from("cases")
    .insert({ user_a_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error creating case:", error);
    throw new Error("Error al crear el expediente");
  }

  revalidatePath("/dashboard");
  return data;
}
