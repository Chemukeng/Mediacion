import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

// This is the entry point — it redirects to the right group
// based on authentication state.
export default function Index() {
  const { user } = useAuthStore();

  if (user) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
