import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";

export default function PerfilScreen() {
  const { profile, signOut } = useAuthStore();

  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader title="Mi Perfil" subtitle="Ajustes de cuenta" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{profile?.full_name || "Usuario"}</CardTitle>
            <CardDescription>
              Perfil de mediador registrado
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-sm font-semibold text-gray-500">Nombre completo</Text>
              <Text className="text-sm text-brand-dark">{profile?.full_name || "No configurado"}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-sm font-semibold text-gray-500">Teléfono</Text>
              <Text className="text-sm text-brand-dark">{profile?.phone || "No configurado"}</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm font-semibold text-gray-500">Verificación KYC</Text>
              <Text className={`text-sm font-bold ${profile?.kyc_verified ? "text-green-600" : "text-amber-600"}`}>
                {profile?.kyc_verified ? "Verificado" : "Pendiente"}
              </Text>
            </View>
          </CardContent>
        </Card>

        <Button
          label="Cerrar Sesión"
          variant="outline"
          onPress={signOut}
          className="border-red-200 text-red-700 mt-4"
        />
      </ScrollView>
    </View>
  );
}
