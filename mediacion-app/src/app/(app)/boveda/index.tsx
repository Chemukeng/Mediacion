import React from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useCaseStore } from "@/store/case.store";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BovedaDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeCase } = useCaseStore();

  // 1. Fetch Basic Questionnaire submission status
  const { data: basicQuestionnaire, isLoading: loadingBasic } = useQuery({
    queryKey: ["basicQuestionnaire", activeCase?.id, user?.id],
    queryFn: async () => {
      if (!activeCase || !user) return null;
      const { data, error } = await supabase
        .from("questionnaire_basic")
        .select("*")
        .eq("case_id", activeCase.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching basic questionnaire:", error);
        return null;
      }
      return data;
    },
    enabled: !!activeCase?.id && !!user?.id,
  });

  // 2. Fetch Dynamic Questions status
  const { data: dynamicQuestions, isLoading: loadingDynamic } = useQuery({
    queryKey: ["dynamicQuestions", activeCase?.id, user?.id],
    queryFn: async () => {
      if (!activeCase || !user) return [];
      const { data, error } = await supabase
        .from("questionnaire_dynamic")
        .select("*")
        .eq("case_id", activeCase.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching dynamic questions:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!activeCase?.id && !!user?.id,
  });

  const isLoading = loadingBasic || loadingDynamic;

  if (!activeCase) {
    return (
      <View className="flex-1 bg-brand-cream">
        <ScreenHeader title="Bóveda Privada" subtitle="Espacio de preparación" />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-4xl mb-4">🔒</Text>
          <Text className="text-lg font-bold text-brand-dark text-center">
            Expediente Requerido
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2 mb-6 px-4">
            Debes iniciar un expediente de mediación en el Vestíbulo antes de poder acceder a tu Bóveda Privada de preparación.
          </Text>
          <Button
            label="Ir al Vestíbulo"
            onPress={() => router.replace("/(app)")}
            className="w-full max-w-xs"
          />
        </View>
      </View>
    );
  }

  // Derive progress
  const basicSubmitted = !!basicQuestionnaire?.submitted_at;
  const totalDynamic = dynamicQuestions?.length || 0;
  const answeredDynamic = dynamicQuestions?.filter((q: any) => !!q.answer_text).length || 0;
  const dynamicSubmitted = totalDynamic > 0 && answeredDynamic === totalDynamic;

  let prepPercent = 0;
  if (basicSubmitted) prepPercent += 33;
  if (dynamicSubmitted) prepPercent += 33;
  if (activeCase.status === "negotiation" || activeCase.status === "signing" || activeCase.status === "completed") {
    prepPercent = 100;
  } else if (basicSubmitted && dynamicSubmitted && activeCase.user_b_id) {
    prepPercent += 34; // Ready to move to negotiation
  }

  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader title="Bóveda Privada" subtitle="Tu espacio 100% confidencial" />
      
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a3e31" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4 space-y-4">
          
          {/* Progress Banner */}
          <Card className="bg-brand-green border-brand-green-light">
            <CardContent className="pt-4">
              <Text className="text-lg font-serif font-bold text-brand-cream italic">
                Espacio de Preparación
              </Text>
              <Text className="text-xs text-brand-cream/70 mt-1 leading-relaxed">
                Todo lo que escribas aquí es privado. Nada se compartirá con la otra parte sin tu consentimiento explícito.
              </Text>
              
              <View className="mt-4">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-[10px] font-bold text-brand-cream uppercase tracking-wider">
                    Estado de preparación
                  </Text>
                  <Text className="text-[10px] font-bold text-brand-cream uppercase">
                    {prepPercent}% Completado
                  </Text>
                </View>
                <View className="w-full bg-brand-green-light/30 h-1.5 rounded-full overflow-hidden">
                  <View 
                    className="bg-brand-cream h-full rounded-full" 
                    style={{ width: `${prepPercent}%` }} 
                  />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Section: Preparation */}
          <View className="space-y-3">
            <View className="flex-row items-center space-x-2 px-1">
              <View className="w-1.5 h-4 bg-brand-green rounded-full" />
              <Text className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                1. Cuestionarios de Diagnóstico
              </Text>
            </View>

            {/* Item 1: Cuestionario Básico */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <CardTitle className="text-base">Cuestionario Básico</CardTitle>
                  <CardDescription className="text-xs">
                    Información familiar y patrimonial esencial para estructurar las bases de la mediación.
                  </CardDescription>
                </View>
                <View className="bg-brand-cream w-8 h-8 rounded-full items-center justify-center border border-gray-100">
                  <Text className="text-xs">{basicSubmitted ? "✅" : "📝"}</Text>
                </View>
              </CardHeader>
              <CardContent className="mt-2">
                <Button
                  label={basicSubmitted ? "Ver Respuestas" : "Rellenar Cuestionario"}
                  variant={basicSubmitted ? "secondary" : "primary"}
                  size="sm"
                  onPress={() => router.push("/boveda/cuestionario-basico" as any)}
                />
              </CardContent>
            </Card>

            {/* Item 2: Cuestionario Dinámico IA */}
            <Card className={!basicSubmitted ? "opacity-60" : ""}>
              <CardHeader className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <CardTitle className="text-base flex-row items-center">
                    Cuestionario Dinámico IA
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Preguntas personalizadas generadas por la IA tras analizar vuestros perfiles familiares.
                  </CardDescription>
                </View>
                <View className="bg-brand-cream w-8 h-8 rounded-full items-center justify-center border border-gray-100">
                  <Text className="text-xs">
                    {!basicSubmitted ? "🔒" : dynamicSubmitted ? "✅" : "✨"}
                  </Text>
                </View>
              </CardHeader>
              <CardContent className="mt-2">
                {!basicSubmitted ? (
                  <Text className="text-[10px] text-gray-400 italic">
                    Bloqueado hasta completar el Cuestionario Básico.
                  </Text>
                ) : totalDynamic === 0 ? (
                  <View className="bg-brand-green/5 border border-brand-green/10 rounded-xl p-3">
                    <Text className="text-xs text-brand-green-light leading-relaxed">
                      La IA está analizando tu perfil básico para generar tus preguntas personalizadas. Esto puede tardar unos momentos.
                    </Text>
                  </View>
                ) : (
                  <Button
                    label={dynamicSubmitted ? "Ver Respuestas" : `Responder Preguntas (${answeredDynamic}/${totalDynamic})`}
                    variant={dynamicSubmitted ? "secondary" : "primary"}
                    size="sm"
                    onPress={() => router.push("/boveda/cuestionario-dinamico" as any)}
                  />
                )}
              </CardContent>
            </Card>
          </View>

          {/* Section: Chat & Dialogue */}
          <View className="space-y-3 pt-2">
            <View className="flex-row items-center space-x-2 px-1">
              <View className="w-1.5 h-4 bg-brand-green rounded-full" />
              <Text className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                2. Intimidad y Apoyo Emocional
              </Text>
            </View>

            {/* Item 3: Chat de Desahogo Privado */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <CardTitle className="text-base">Diario de Desahogo Privado</CardTitle>
                  <CardDescription className="text-xs">
                    Conversa y gestiona tus dudas o emociones de manera segura con el asistente de IA especializado.
                  </CardDescription>
                </View>
                <View className="bg-brand-cream w-8 h-8 rounded-full items-center justify-center border border-gray-100">
                  <Text className="text-xs">💬</Text>
                </View>
              </CardHeader>
              <CardContent className="mt-2">
                <Button
                  label="Abrir Chat Privado"
                  variant="outline"
                  size="sm"
                  onPress={() => router.push("/boveda/chat-privado" as any)}
                />
              </CardContent>
            </Card>
          </View>

          {/* Footer message */}
          <View className="items-center py-6 space-y-2 mt-4">
            <Text className="text-xl">🛡️</Text>
            <Text className="text-[10px] font-bold text-brand-green uppercase tracking-widest">
              Tu Zona Siempre Segura
            </Text>
            <Text className="text-[10px] text-gray-400 text-center max-w-[280px]">
              Tus borradores e información están encriptados y protegidos con seguridad RLS de grado bancario.
            </Text>
          </View>

        </ScrollView>
      )}
    </View>
  );
}
