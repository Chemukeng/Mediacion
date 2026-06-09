import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useAuthStore } from '@/store/auth.store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Inner component — lives inside the providers so hooks work correctly
function RootLayoutNav() {
  useAuthListener();
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fbf9f4' }}>
        <ActivityIndicator size="large" color="#1a3e31" />
      </View>
    );
  }

  // The Stack MUST always render — it owns the NavigationContainer
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="invite/[token]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
