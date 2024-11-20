import { Stack } from "expo-router";
import { TrackedAppsStorageProvider } from "@/context/trackedAppsStorage";
import { StatsStorageProvider } from "@/context/statsStorage";

export default function Layout() {
  return (
    <TrackedAppsStorageProvider>
      <StatsStorageProvider>
        <Stack
          initialRouteName="home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="home" />
          <Stack.Screen name="statsScreen"/>
          <Stack.Screen name="statsStorageScreen"/>
          <Stack.Screen name="trackedAppsList"/>
          <Stack.Screen name="chat"/>
        </Stack>
      </StatsStorageProvider>
    </TrackedAppsStorageProvider>
  );
}