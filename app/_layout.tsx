import { Stack } from "expo-router";
import { TrackedAppsStorageProvider } from "@/contexts/trackedAppsStorage";
import { StatsStorageProvider } from "@/contexts/statsStorage";

export default function RootLayout() {
  return (
    <TrackedAppsStorageProvider>
      <StatsStorageProvider>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </StatsStorageProvider>
    </TrackedAppsStorageProvider>
  );
}
