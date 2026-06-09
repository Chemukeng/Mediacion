import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { useCaseStore } from "@/store/case.store";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/shared/ScreenHeader";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { user, profile, signOut } = useAuthStore();
  const { setActiveCase } = useCaseStore();

  // 1. Fetch active case (where user is either User A or User B)
  const { data: activeCase, isLoading, refetch } = useQuery({
    queryKey: ["activeCase", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          user_a_profile:profiles!cases_user_a_id_fkey(full_name, avatar_url),
          user_b_profile:profiles!cases_user_b_id_fkey(full_name, avatar_url)
        `)
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching cases:", error);
        return null;
      }
      
      const caseRecord = data && data.length > 0 ? data[0] : null;
      setActiveCase(caseRecord);
      return caseRecord;
    },
    enabled: !!user?.id,
  });

  // 2. Mutation to create a new case
  const createCaseMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No has iniciado sesión");
      const { data, error } = await supabase
        .from("cases")
        .insert({
          user_a_id: user.id,
          status: "pending_partner",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeCase", user?.id] });
      Alert.alert("Éxito", "Expediente de mediación iniciado correctamente.");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "No se pudo iniciar el expediente");
    },
  });

  // 3. Developer helper: Simulate Marta joining the case
  const handleSimulateJoin = async () => {
    if (!activeCase) return;
    try {
      // Fetch profiles that are not the current user
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (pError) throw pError;

      const partner = profiles.find((p) => p.id !== user?.id);
      if (!partner) {
        Alert.alert(
          "Simulación",
          "Para simular que Marta se une, primero crea la cuenta de Marta (marta@test.com) desde el panel de Supabase o regístrala desde la pantalla de login.",
          [{ text: "Entendido" }]
        );
        return;
      }

      // Update case to include Marta and move to questionnaires phase
      const { error } = await supabase
        .from("cases")
        .update({
          user_b_id: partner.id,
          status: "questionnaires",
        })
        .eq("id", activeCase.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["activeCase", user?.id] });
      Alert.alert(
        "Simulación Completada",
        `Se ha simulado que ${partner.full_name || "Marta"} se ha unido al expediente.`
      );
    } catch (err: any) {
      Alert.alert("Error en simulación", err.message || "Ocurrió un error");
    }
  };

  // 4. Developer helper: Reset case to start over
  const handleResetCase = async () => {
    if (!activeCase) return;
    Alert.alert(
      "Reiniciar Proceso",
      "¿Estás seguro de que quieres eliminar el expediente actual y empezar de cero?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, reiniciar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("cases")
                .delete()
                .eq("id", activeCase.id);

              if (error) throw error;
              setActiveCase(null);
              queryClient.invalidateQueries({ queryKey: ["activeCase", user?.id] });
              Alert.alert("Reinicio Exitoso", "Expediente eliminado. Puedes iniciar de nuevo.");
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  // 5. Copy invite link to clipboard
  const handleCopyLink = async () => {
    if (!activeCase) return;
    // In a real app, this would use deep linking, e.g. mediacion://invitar/[token]
    const inviteLink = `https://mediador.ia/invite/${activeCase.invite_token}`;
    await Clipboard.setStringAsync(inviteLink);
    Alert.alert("Enlace Copiado", "El enlace de invitación se ha copiado al portapapeles.");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-brand-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1a3e31" />
        <Text className="text-sm text-gray-500 mt-3">Cargando expediente...</Text>
      </SafeAreaView>
    );
  }

  // Render header right action (Sign Out)
  const headerRight = (
    <TouchableOpacity onPress={signOut} className="bg-brand-green-light px-3 py-1.5 rounded-lg">
      <Text className="text-xs font-bold text-brand-cream">SALIR</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader
        title="Vestíbulo Principal"
        subtitle={profile?.full_name ? `Hola, ${profile.full_name}` : "Hola"}
        rightAction={headerRight}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {activeCase ? (
          <View className="space-y-4">
            {/* Active Case Status Card */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <CardTitle>Expediente de Mediación</CardTitle>
                  <CardDescription>
                    ID: {activeCase.id.substring(0, 8)}...
                  </CardDescription>
                </View>
                <Badge
                  label={
                    activeCase.status === "pending_partner"
                      ? "Esperando Pareja"
                      : activeCase.status === "questionnaires"
                      ? "Cuestionarios"
                      : activeCase.status === "negotiation"
                      ? "Negociación"
                      : activeCase.status === "signing"
                      ? "Convenio/Firma"
                      : "Completado"
                  }
                  variant={
                    activeCase.status === "completed"
                      ? "success"
                      : activeCase.status === "negotiation"
                      ? "brand"
                      : "warning"
                  }
                />
              </CardHeader>
              <CardContent className="mt-2">
                {activeCase.status === "pending_partner" && (
                  <View className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 mt-2">
                    <Text className="text-sm font-semibold text-amber-800 mb-1">
                      Invitación Pendiente
                    </Text>
                    <Text className="text-xs text-amber-700 leading-relaxed mb-4">
                      Comparte el enlace de abajo con la otra parte para que pueda unirse a la mediación.
                    </Text>
                    <Button
                      label="Copiar Enlace de Invitación"
                      variant="secondary"
                      size="sm"
                      onPress={handleCopyLink}
                    />
                  </View>
                )}

                {activeCase.status === "questionnaires" && (
                  <View className="bg-brand-green/5 border border-brand-green/10 rounded-xl p-4 mt-2">
                    <Text className="text-sm font-semibold text-brand-green mb-1">
                      Fase de Cuestionarios
                    </Text>
                    <Text className="text-xs text-brand-green-light leading-relaxed mb-4">
                      Ambos debéis completar el cuestionario básico y las preguntas dinámicas para preparar los temas de la mesa de negociación.
                    </Text>
                    <View className="space-y-2">
                      <Button
                        label="Ir al Cuestionario Básico"
                        variant="primary"
                        size="sm"
                        className="mb-2"
                        onPress={() => Alert.alert("Navegar", "Cuestionario básico en desarrollo.")}
                      />
                      <Button
                        label="Hablar con Asistente IA"
                        variant="outline"
                        size="sm"
                        onPress={() => Alert.alert("Navegar", "Asistente IA en desarrollo.")}
                      />
                    </View>
                  </View>
                )}

                {/* Case Details */}
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <Text className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    Participantes
                  </Text>
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="text-sm font-medium text-brand-dark">Parte A (Tú)</Text>
                    <Text className="text-sm text-gray-500">
                      {activeCase.user_a_profile?.full_name || "Usuario A"}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-brand-dark">Parte B</Text>
                    <Text className="text-sm text-gray-500">
                      {activeCase.user_b_profile?.full_name || "Pendiente de unirse..."}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Developer Testing Section */}
            <Card className="bg-gray-50 border-gray-200 mt-4">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">
                  Herramientas de Desarrollador
                </CardTitle>
                <CardDescription>
                  Acciones para facilitar las pruebas del flujo de la app.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-2 space-y-2">
                {activeCase.status === "pending_partner" && (
                  <Button
                    label="Simular Aceptación de Marta"
                    variant="secondary"
                    size="sm"
                    className="mb-2"
                    onPress={handleSimulateJoin}
                  />
                )}
                <Button
                  label="Eliminar Expediente (Reiniciar)"
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-700"
                  onPress={handleResetCase}
                />
              </CardContent>
            </Card>
          </View>
        ) : (
          /* Empty State - Create Case */
          <View className="flex-1 items-center justify-center py-12">
            <View className="bg-brand-green/10 w-20 h-20 rounded-full items-center justify-center mb-6">
              <Text className="text-brand-green text-3xl">⚖️</Text>
            </View>
            <Text className="text-xl font-bold text-brand-dark text-center px-4">
              No tienes ningún expediente activo
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2 mb-8 px-6 leading-relaxed">
              Inicia un nuevo expediente de mediación familiar guiado por inteligencia artificial para resolver vuestro convenio regulador de manera amistosa y legal.
            </Text>
            <Button
              label="Iniciar Nuevo Expediente"
              onPress={() => createCaseMutation.mutate()}
              loading={createCaseMutation.isPending}
              className="w-full max-w-xs"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
