import { useEffect } from "react";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { DB_NAME, initDb } from "@/lib/db";
import { detectLanguage } from "@/lib/language";
import { ensurePurchasesConfigured } from "@/lib/purchases";
import { colors } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const TITLES: Record<
  ExplainLanguage,
  { history: string; profiles: string; interactions: string; premium: string; settings: string }
> = {
  pt: { history: "Histórico", profiles: "Perfis da família", interactions: "Checar interações", premium: "Explicare Premium", settings: "Ajustes e privacidade" },
  en: { history: "History", profiles: "Family profiles", interactions: "Check interactions", premium: "Explicare Premium", settings: "Settings & privacy" },
  es: { history: "Historial", profiles: "Perfiles familiares", interactions: "Verificar interacciones", premium: "Explicare Premium", settings: "Ajustes y privacidad" },
  fr: { history: "Historique", profiles: "Profils familiaux", interactions: "Vérifier les interactions", premium: "Explicare Premium", settings: "Réglages et confidentialité" },
  zh: { history: "历史记录", profiles: "家庭档案", interactions: "检查相互作用", premium: "Explicare 高级版", settings: "设置与隐私" },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const t = TITLES[detectLanguage()];

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
        <Stack.Screen name="history" options={{ title: t.history }} />
        <Stack.Screen name="profiles" options={{ title: t.profiles }} />
        <Stack.Screen name="interactions" options={{ title: t.interactions }} />
        <Stack.Screen name="paywall" options={{ title: t.premium, presentation: "modal" }} />
        <Stack.Screen name="settings" options={{ title: t.settings }} />
      </Stack>
    </SQLiteProvider>
  );
}
