import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function MesaScreen() {
  return (
    <View className="flex-1 bg-brand-cream">
      <ScreenHeader title="Mesa de Negociación" subtitle="Puntos de acuerdo" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Mesa Virtual</CardTitle>
            <CardDescription>
              Aquí debatiréis y firmaréis vuestro convenio regulador en tiempo real una vez completada la fase de Bóveda.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <Text className="text-sm text-brand-dark leading-relaxed">
              Esta sección se desbloqueará cuando ambos hayáis respondido los cuestionarios. En ella podréis votar cada propuesta generada por la IA y redactar el borrador final.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
