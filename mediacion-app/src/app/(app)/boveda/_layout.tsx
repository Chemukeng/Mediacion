import { Stack } from 'expo-router';

export default function BovedaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cuestionario-basico" />
      <Stack.Screen name="cuestionario-dinamico" />
      <Stack.Screen name="asistente" />
      <Stack.Screen name="chat-privado" />
    </Stack>
  );
}
