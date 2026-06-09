import { Redirect, Tabs } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const { user } = useAuthStore();

  // If user is NOT logged in, redirect to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1a3e31', // Brand green
        tabBarInactiveTintColor: '#8c9c94', // Brand muted green/gray
        tabBarStyle: {
          backgroundColor: '#fbf9f4', // Brand cream
          borderTopWidth: 1,
          borderTopColor: '#e6e3db',
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'boveda') {
            iconName = focused ? 'lock-closed' : 'lock-closed-outline';
          } else if (route.name === 'mesa') {
            iconName = focused ? 'hammer' : 'hammer-outline';
          } else if (route.name === 'perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vestíbulo',
        }}
      />
      <Tabs.Screen
        name="boveda"
        options={{
          title: 'Bóveda',
        }}
      />
      <Tabs.Screen
        name="mesa"
        options={{
          title: 'Mesa',
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
