import { Text } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth, AuthProvider } from '@/context/auth';
import { useRouter, Slot } from 'expo-router';

const AuthWait = ({ children }: { children: React.ReactNode }) => {
  const authContext = useAuth();

  const {initializing, user} = authContext
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/app');
    } else {
      router.replace('/auth');
    }
  }, [user, initializing]);

  if (initializing) return (<Text>INICIALIZANDO</Text>);

  return (<>{children}</>);
};

export default function Layout() {
  return (

    <AuthProvider>
      <AuthWait>
        <Slot />
      </AuthWait>
    </AuthProvider>
  )
}