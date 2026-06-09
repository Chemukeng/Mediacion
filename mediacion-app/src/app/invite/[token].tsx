import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/shared/ScreenHeader";

export default function InviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // 1. Fetch case details from token
  const { data: inviteCase, isLoading, error } = useQuery({
    queryKey: ["inviteCase", token],
    queryFn: async () => {
      if (!token) return null;
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          user_a_profile:profiles!cases_user_a_id_fkey(full_name, avatar_url)
        `)
        .eq("invite_token", token)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });

  // 2. Mutation to accept the invitation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Debes iniciar sesión para aceptar la invitación.");
      if (!inviteCase) throw new Error("Invitación no válida.");

      if (inviteCase.user_a_id === user.id) {
        throw new Error("No puedes aceptar tu propia invitación.");
      }

      const { data, error } = await supabase
        .from("cases")
        .update({
          user_b_id: user.id,
          status: "questionnaires",
        })
        .eq("id", inviteCase.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeCase", user?.id] });
      Alert.alert(
        "Invitación Aceptada",
        "Te has unido con éxito al expediente de mediación.",
        [
          {
            text: "Ir al Vestíbulo",
            onPress: () => router.replace("/(app)"),
          },
        ]
      );
    },
    onError: (err: any) => {
      Alert.alert("Error", err.message || "No se pudo aceptar la invitación.");
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-brand-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1a3e31" />
        <Text className="text-sm text-gray-500 mt-3">Validando invitación...</Text>
      </SafeAreaView>
    );
  }

  if (error || !inviteCase) {
    return (
      <SafeAreaView className="flex-1 bg-brand-cream p-6 justify-center items-center">
        <Text className="text-4xl mb-4">⚠️</Text>
        <Text className="text-lg font-bold text-brand-dark text-center">
          Invitación No Válida
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2 mb-8">
          El enlace de invitación ha expirado o no corresponde a un expediente activo.
        </Text>
        <Button
          label="Volver al Inicio"
          onPress={() => router.replace("/(app)")}
          className="w-full max-w-xs"
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader title="Invitación Recibida" showBackButton={true} />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4 justify-center">
        <Card className="mb-6">
          <CardHeader className="items-center py-4">
            <View className="bg-brand-green/10 w-16 h-16 rounded-full items-center justify-center mb-4">
              <Text className="text-brand-green text-2xl">🤝</Text>
            </View>
            <CardTitle className="text-center">Invitación a Mediación</CardTitle>
            <CardDescription className="text-center mt-1">
              Has sido invitado a unirte a un expediente de resolución de convenios.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <View className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              <Text className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Invitado por:
              </Text>
              <Text className="text-base font-bold text-brand-dark">
                {inviteCase.user_a_profile?.full_name || "Usuario de MedIAdor"}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Parte promotora del expediente de mediación
              </Text>
            </View>

            <Text className="text-xs text-gray-500 mb-6 leading-relaxed text-center px-4">
              Al aceptar esta invitación, te vincularás al expediente y ambos podréis iniciar los cuestionarios obligatorios para redactar vuestro Convenio Regulador de mutuo acuerdo.
            </Text>

            <Button
              label="Aceptar y Unirse"
              onPress={() => acceptMutation.mutate()}
              loading={acceptMutation.isPending}
            />
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
