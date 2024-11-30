import { Stack } from "expo-router";
import { TrackedAppsStorageProvider } from "@/context/trackedAppsStorage";
import { StatsStorageProvider } from "@/context/statsStorage";
import { GlobalFontProvider } from '@/context/globalFonts';

export default function Layout() {
  return (
    <GlobalFontProvider>
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
    </GlobalFontProvider>
  );
}