import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useCaseStore } from "@/store/case.store";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface DynamicQuestion {
  id: string;
  question_text: string;
  answer_text: string | null;
  answered_at: string | null;
  order_index: number;
}

export default function CuestionarioDinamico() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { activeCase } = useCaseStore();

  // Local state for answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 1. Fetch Dynamic Questions
  const { data: questions, isLoading } = useQuery<DynamicQuestion[]>({
    queryKey: ["dynamicQuestionsData", activeCase?.id, user?.id],
    queryFn: async () => {
      if (!activeCase || !user) return [];
      const { data, error } = await supabase
        .from("questionnaire_dynamic")
        .select("*")
        .eq("case_id", activeCase.id)
        .eq("user_id", user.id)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching dynamic questions:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!activeCase?.id && !!user?.id,
  });

  // Populate answers state from fetched data
  useEffect(() => {
    if (questions) {
      const initialAnswers: Record<string, string> = {};
      questions.forEach((q) => {
        initialAnswers[q.id] = q.answer_text || "";
      });
      setAnswers(initialAnswers);
    }
  }, [questions]);

  // Check if all questions are answered and if the questionnaire is sealed/submitted
  const allAnswered = questions && questions.length > 0 && questions.every(q => !!answers[q.id]?.trim());
  const isSealed = questions && questions.length > 0 && questions.every(q => !!q.answered_at);

  // 2. Submit Mutation
  const saveAnswersMutation = useMutation({
    mutationFn: async (sealNow: boolean) => {
      if (!activeCase || !user || !questions) throw new Error("No hay expediente activo o sesión iniciada");

      const updates = questions.map((q) => ({
        id: q.id,
        case_id: activeCase.id,
        user_id: user.id,
        question_text: q.question_text,
        order_index: q.order_index,
        answer_text: answers[q.id] || null,
        answered_at: sealNow ? new Date().toISOString() : q.answered_at,
      }));

      const { data, error } = await supabase
        .from("questionnaire_dynamic")
        .upsert(updates)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dynamicQuestions", activeCase?.id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["dynamicQuestionsData", activeCase?.id, user?.id] });
      
      const isNowSealed = data.every((q: any) => !!q.answered_at);
      if (isNowSealed) {
        Alert.alert("Respuestas Enviadas", "Tus respuestas se han guardado con éxito y se han sellado en tu Bóveda Privada.", [
          { text: "Entendido", onPress: () => router.replace("/boveda" as any) },
        ]);
      } else {
        Alert.alert("Borrador Guardado", "Tus respuestas se han guardado de forma segura.");
      }
    },
    onError: (err: any) => {
      Alert.alert("Error al guardar", err.message || "Ocurrió un error al guardar tus respuestas.");
    },
  });

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader title="Cuestionario Dinámico" subtitle="Preguntas personalizadas por IA" showBackButton={true} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a3e31" />
        </View>
      ) : !questions || questions.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-4xl mb-4">✨</Text>
          <Text className="text-lg font-bold text-brand-dark text-center">
            Analizando tus respuestas...
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2 px-4 leading-relaxed">
            Nuestra IA está preparando las preguntas personalizadas para tu caso. Vuelve en unos momentos o asegúrate de que ambos perfiles habéis completado el Cuestionario Básico.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4 space-y-5">

          {/* Locked header banner if sealed */}
          {isSealed && (
            <View className="bg-green-50 border border-green-200 rounded-xl p-3.5 flex-row space-x-2">
              <Ionicons name="lock-closed" size={16} color="#166534" className="mt-0.5" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-green-800">
                  Cuestionario Dinámico Sellado
                </Text>
                <Text className="text-[10px] text-green-700 mt-0.5 leading-relaxed">
                  Tus respuestas se han cifrado y sellado de forma confidencial. Se utilizarán únicamente para buscar puntos en común en la Mesa de Negociación.
                </Text>
              </View>
            </View>
          )}

          {/* Intro Notice */}
          <View className="bg-brand-gold/5 border border-brand-gold/25 rounded-2xl p-4 flex-row space-x-2">
            <Ionicons name="shield-checkmark" size={18} color="#B5944E" className="mt-0.5" />
            <Text className="text-xs text-[#5E5136] italic leading-relaxed flex-1">
              Mediador IA: "He analizado vuestros perfiles y objetivos. Aquí tenéis unas preguntas clave. Tus respuestas son estrictamente confidenciales y tu expareja no las verá directamente."
            </Text>
          </View>

          {/* List of Questions */}
          <View className="space-y-4">
            {questions.map((q, idx) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-sm text-brand-green leading-relaxed">
                    Pregunta {idx + 1} de {questions.length}
                  </CardTitle>
                  <Text className="text-xs font-bold text-brand-dark leading-relaxed mt-1">
                    {q.question_text}
                  </Text>
                </CardHeader>
                <CardContent className="mt-2">
                  <TextInput
                    editable={!isSealed}
                    multiline
                    numberOfLines={3}
                    value={answers[q.id] || ""}
                    onChangeText={(text) => handleAnswerChange(q.id, text)}
                    placeholder="Escribe tu propuesta o respuesta detallada aquí..."
                    placeholderTextColor="#9ca3af"
                    style={{ textAlignVertical: "top" }}
                    className="bg-brand-cream/50 border border-gray-200 rounded-xl px-3 py-3 text-xs text-brand-dark min-h-[72px]"
                  />
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Actions */}
          <View className="pt-4 pb-8">
            {isSealed ? (
              <View className="bg-[#1C2A25] rounded-xl py-4 flex-row justify-center items-center space-x-2">
                <Ionicons name="lock-closed" size={14} color="#fbf9f4" />
                <Text className="text-sm font-semibold text-brand-cream">
                  Respuestas Selladas en Bóveda
                </Text>
              </View>
            ) : (
              <View className="space-y-2">
                <Button
                  label="Enviar y Sellar Respuestas"
                  variant="primary"
                  disabled={!allAnswered}
                  loading={saveAnswersMutation.isPending}
                  onPress={() => {
                    Alert.alert(
                      "¿Enviar Respuestas?",
                      "Una vez selladas, no podrás editarlas para garantizar un proceso de mediación limpio. ¿Confirmas el envío?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Sí, Enviar", onPress: () => saveAnswersMutation.mutate(true) },
                      ]
                    );
                  }}
                />
                <Button
                  label="Guardar Borrador"
                  variant="outline"
                  loading={saveAnswersMutation.isPending}
                  onPress={() => saveAnswersMutation.mutate(false)}
                />
              </View>
            )}
          </View>

        </ScrollView>
      )}
    </View>
  );
}
