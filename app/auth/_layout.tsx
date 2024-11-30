import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth";
import { GlobalFontProvider } from '@/context/globalFonts';

export default function AppLayout() {
  return (
    <GlobalFontProvider>
      <AuthProvider>
        <Stack
          initialRouteName="home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="home" />
          <Stack.Screen name="login" />
        </Stack>
      </AuthProvider>
    </GlobalFontProvider>
  );
}