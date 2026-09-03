import { useEffect } from "react";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { DB_NAME, initDb } from "@/lib/db";
import { ensurePurchasesConfigured } from "@/lib/purchases";
import { colors } from "@/lib/theme";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    ensurePurchasesConfigured();
  }, []);

  return (
    <SQLiteProvider databaseName={DB_NAME} onInit={initDb}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false, presentation: "fullScreenModal" }} />
        <Stack.Screen name="result" options={{ title: "" }} />
        <Stack.Screen name="history" options={{ title: "Histórico" }} />
        <Stack.Screen name="profiles" options={{ title: "Perfis da família" }} />
        <Stack.Screen name="interactions" options={{ title: "Checar interações" }} />
        <Stack.Screen name="paywall" options={{ title: "Bula Fácil Premium", presentation: "modal" }} />
        <Stack.Screen name="settings" options={{ title: "Ajustes e privacidade" }} />
      </Stack>
    </SQLiteProvider>
  );
}
