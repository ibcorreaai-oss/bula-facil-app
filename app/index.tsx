import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ConsentModal } from "@/components/ConsentModal";
import { countScans } from "@/lib/db";
import { displayProfileName, getActiveProfile } from "@/lib/activeProfile";
import { grantAiConsent, hasAiConsent } from "@/lib/consent";
import { detectLanguage } from "@/lib/language";
import { setPendingPhoto } from "@/lib/pendingPhoto";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const L: Record<
  ExplainLanguage,
  {
    badge: string;
    scanningFor: string;
    subtitle: string;
    cameraCardTitle: string;
    cameraCardSubtitle: string;
    gallery: string;
    history: string;
    settings: string;
    premiumBanner: string;
  }
> = {
  pt: {
    badge: "💊🩺 Grátis · Não é orientação médica",
    scanningFor: "👤 Escaneando para:",
    subtitle: "Fotografe uma bula, caixa de remédio, receita ou exame e entenda em poucos segundos, em linguagem simples.",
    cameraCardTitle: "Fotografar agora",
    cameraCardSubtitle: "Aponte a câmera pra bula, caixa, receita ou exame",
    gallery: "Escolher foto da galeria",
    history: "Histórico",
    settings: "Ajustes",
    premiumBanner: "✨ Explicare Premium — histórico ilimitado, lembretes e perfis da família",
  },
  en: {
    badge: "💊🩺 Free · Not medical advice",
    scanningFor: "👤 Scanning for:",
    subtitle: "Photograph a medicine label, package insert, prescription, or lab result and understand it in seconds, in plain language.",
    cameraCardTitle: "Take a photo now",
    cameraCardSubtitle: "Point the camera at the label, box, prescription, or lab result",
    gallery: "Choose photo from gallery",
    history: "History",
    settings: "Settings",
    premiumBanner: "✨ Explicare Premium — unlimited history, reminders, and family profiles",
  },
  es: {
    badge: "💊🩺 Gratis · No es orientación médica",
    scanningFor: "👤 Escaneando para:",
    subtitle: "Fotografíe una etiqueta, prospecto, receta o resultado de laboratorio y entiéndalo en segundos, en lenguaje simple.",
    cameraCardTitle: "Tomar foto ahora",
    cameraCardSubtitle: "Apunte la cámara a la etiqueta, caja, receta o resultado",
    gallery: "Elegir foto de la galería",
    history: "Historial",
    settings: "Ajustes",
    premiumBanner: "✨ Explicare Premium — historial ilimitado, recordatorios y perfiles familiares",
  },
  fr: {
    badge: "💊🩺 Gratuit · Pas un avis médical",
    scanningFor: "👤 Analyse pour :",
    subtitle: "Photographiez une étiquette, une notice, une ordonnance ou un résultat d'analyse et comprenez-le en quelques secondes, en langage simple.",
    cameraCardTitle: "Prendre une photo",
    cameraCardSubtitle: "Pointez la caméra vers l'étiquette, la boîte, l'ordonnance ou le résultat",
    gallery: "Choisir une photo dans la galerie",
    history: "Historique",
    settings: "Réglages",
    premiumBanner: "✨ Explicare Premium — historique illimité, rappels et profils familiaux",
  },
  zh: {
    badge: "💊🩺 免费 · 非医疗建议",
    scanningFor: "👤 正在为以下对象扫描：",
    subtitle: "拍摄药品标签、说明书、处方或化验单，几秒钟内用简单的语言帮您理解。",
    cameraCardTitle: "立即拍照",
    cameraCardSubtitle: "将相机对准标签、包装盒、处方或化验单",
    gallery: "从相册选择照片",
    history: "历史记录",
    settings: "设置",
    premiumBanner: "✨ Explicare 高级版 — 无限历史记录、提醒和家庭档案",
  },
};

export default function Home() {
  const router = useRouter();
  const db = useSQLiteContext();
  const language = detectLanguage();
  const t = L[language];
  const [scanCount, setScanCount] = useState(0);
  const [activeProfile, setActiveProfileState] = useState("Eu");
  const [consentVisible, setConsentVisible] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      countScans(db).then(setScanCount);
      getActiveProfile().then(setActiveProfileState);
    }, [db])
  );

  async function withConsent(action: () => void) {
    if (await hasAiConsent()) {
      action();
      return;
    }
    pendingActionRef.current = action;
    setConsentVisible(true);
  }

  async function handleConsentAgree() {
    await grantAiConsent();
    setConsentVisible(false);
    pendingActionRef.current?.();
    pendingActionRef.current = null;
  }

  function handleConsentCancel() {
    setConsentVisible(false);
    pendingActionRef.current = null;
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (result.canceled || !result.assets[0]) return;
    setPendingPhoto(result.assets[0].uri);
    router.push("/result");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{t.badge}</Text>
      </View>
      <Text style={styles.title}>Explicare</Text>
      <Pressable style={styles.profilePill} onPress={() => router.push("/profiles")}>
        <Text style={styles.profilePillText}>{t.scanningFor} {displayProfileName(activeProfile, language)}</Text>
      </Pressable>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <Pressable style={styles.cameraCard} onPress={() => withConsent(() => router.push("/camera"))}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraCardTitle}>{t.cameraCardTitle}</Text>
        <Text style={styles.cameraCardSubtitle}>{t.cameraCardSubtitle}</Text>
      </Pressable>

      <PrimaryButton
        label={t.gallery}
        onPress={() => withConsent(pickFromGallery)}
        variant="secondary"
      />

      <ConsentModal
        visible={consentVisible}
        onAgree={handleConsentAgree}
        onCancel={handleConsentCancel}
        language={language}
      />

      <View style={styles.row}>
        <Pressable style={styles.linkCard} onPress={() => router.push("/history")}>
          <Text style={styles.linkIcon}>🗂️</Text>
          <Text style={styles.linkText}>{t.history}{scanCount > 0 ? ` (${scanCount})` : ""}</Text>
        </Pressable>
        <Pressable style={styles.linkCard} onPress={() => router.push("/settings")}>
          <Text style={styles.linkIcon}>⚙️</Text>
          <Text style={styles.linkText}>{t.settings}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.premiumBanner} onPress={() => router.push("/paywall")}>
        <Text style={styles.premiumText}>{t.premiumBanner}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingTop: spacing.xl * 1.5, gap: spacing.md, backgroundColor: colors.bg, flexGrow: 1 },
  badge: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  badgeText: { color: colors.primaryDark, fontSize: 12, fontWeight: "700" },
  profilePill: { alignSelf: "center", marginTop: spacing.xs },
  profilePillText: { color: colors.primaryDark, fontSize: 13, fontWeight: "700", textDecorationLine: "underline" },
  title: { fontSize: 34, fontWeight: "900", color: colors.text, textAlign: "center", marginTop: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textMuted, textAlign: "center", lineHeight: 21, marginBottom: spacing.sm },
  cameraCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  cameraIcon: { fontSize: 40 },
  cameraCardTitle: { fontSize: 19, fontWeight: "800", color: colors.onPrimary },
  cameraCardSubtitle: { fontSize: 13, color: "#CCFBF1" },
  row: { flexDirection: "row", gap: spacing.md },
  linkCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  linkIcon: { fontSize: 20 },
  linkText: { fontSize: 13, fontWeight: "700", color: colors.text },
  premiumBanner: {
    backgroundColor: "#FFFBEB",
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  premiumText: { color: colors.warning, fontSize: 13, fontWeight: "700", textAlign: "center" },
});
