import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth";

export default function AppLayout() {
  return (
    <AuthProvider>
      <Stack
        initialRouteName="home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="login" />
      </Stack>
    </AuthProvider>
  );
}