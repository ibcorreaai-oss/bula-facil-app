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
import { getLastSelectedDocumentType, setLastSelectedDocumentType, setPendingPhoto } from "@/lib/pendingPhoto";
import { colors, radius, spacing } from "@/lib/theme";
import { DocumentType, ExplainLanguage } from "@/lib/types";

const L: Record<
  ExplainLanguage,
  {
    badge: string;
    scanningFor: string;
    typeMedication: string;
    typeLab: string;
    cameraCardTitle: Record<DocumentType, string>;
    cameraCardSubtitle: Record<DocumentType, string>;
    gallery: string;
    history: string;
    settings: string;
    premiumBanner: string;
  }
> = {
  pt: {
    badge: "💊🩺 Grátis · Não é orientação médica",
    scanningFor: "👤 Escaneando para:",
    typeMedication: "💊 Remédio ou receita",
    typeLab: "🧪 Exame de laboratório",
    cameraCardTitle: { medication: "Fotografar agora", lab: "Fotografar exame" },
    cameraCardSubtitle: {
      medication: "Aponte a câmera pra bula, caixa ou receita",
      lab: "Aponte a câmera pro resultado do seu exame",
    },
    gallery: "Escolher foto da galeria",
    history: "Histórico",
    settings: "Ajustes",
    premiumBanner: "✨ Explicare Premium — histórico ilimitado, lembretes e perfis da família",
  },
  en: {
    badge: "💊🩺 Free · Not medical advice",
    scanningFor: "👤 Scanning for:",
    typeMedication: "💊 Medicine or prescription",
    typeLab: "🧪 Lab result",
    cameraCardTitle: { medication: "Take a photo now", lab: "Photograph your result" },
    cameraCardSubtitle: {
      medication: "Point the camera at the label, box, or prescription",
      lab: "Point the camera at your lab result",
    },
    gallery: "Choose photo from gallery",
    history: "History",
    settings: "Settings",
    premiumBanner: "✨ Explicare Premium — unlimited history, reminders, and family profiles",
  },
  es: {
    badge: "💊🩺 Gratis · No es orientación médica",
    scanningFor: "👤 Escaneando para:",
    typeMedication: "💊 Medicamento o receta",
    typeLab: "🧪 Resultado de laboratorio",
    cameraCardTitle: { medication: "Tomar foto ahora", lab: "Fotografiar resultado" },
    cameraCardSubtitle: {
      medication: "Apunte la cámara a la etiqueta, caja o receta",
      lab: "Apunte la cámara a su resultado de laboratorio",
    },
    gallery: "Elegir foto de la galería",
    history: "Historial",
    settings: "Ajustes",
    premiumBanner: "✨ Explicare Premium — historial ilimitado, recordatorios y perfiles familiares",
  },
  fr: {
    badge: "💊🩺 Gratuit · Pas un avis médical",
    scanningFor: "👤 Analyse pour :",
    typeMedication: "💊 Médicament ou ordonnance",
    typeLab: "🧪 Résultat d'analyse",
    cameraCardTitle: { medication: "Prendre une photo", lab: "Photographier le résultat" },
    cameraCardSubtitle: {
      medication: "Pointez la caméra vers l'étiquette, la boîte ou l'ordonnance",
      lab: "Pointez la caméra vers votre résultat d'analyse",
    },
    gallery: "Choisir une photo dans la galerie",
    history: "Historique",
    settings: "Réglages",
    premiumBanner: "✨ Explicare Premium — historique illimité, rappels et profils familiaux",
  },
  zh: {
    badge: "💊🩺 免费 · 非医疗建议",
    scanningFor: "👤 正在为以下对象扫描：",
    typeMedication: "💊 药品或处方",
    typeLab: "🧪 化验单",
    cameraCardTitle: { medication: "立即拍照", lab: "拍摄化验单" },
    cameraCardSubtitle: {
      medication: "将相机对准标签、包装盒或处方",
      lab: "将相机对准您的化验单",
    },
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
  const [documentType, setDocumentTypeState] = useState<DocumentType>(getLastSelectedDocumentType);
  function setDocumentType(type: DocumentType) {
    setDocumentTypeState(type);
    setLastSelectedDocumentType(type);
  }
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
    setPendingPhoto(result.assets[0].uri, documentType);
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

      <View style={styles.typeRow}>
        <Pressable
          style={[styles.typePill, documentType === "medication" && styles.typePillActive]}
          onPress={() => setDocumentType("medication")}
        >
          <Text style={[styles.typePillText, documentType === "medication" && styles.typePillTextActive]}>
            {t.typeMedication}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.typePill, documentType === "lab" && styles.typePillActive]}
          onPress={() => setDocumentType("lab")}
        >
          <Text style={[styles.typePillText, documentType === "lab" && styles.typePillTextActive]}>{t.typeLab}</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.cameraCard}
        onPress={() => withConsent(() => router.push({ pathname: "/camera", params: { documentType } }))}
      >
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraCardTitle}>{t.cameraCardTitle[documentType]}</Text>
        <Text style={styles.cameraCardSubtitle}>{t.cameraCardSubtitle[documentType]}</Text>
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
  typeRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  typePill: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  typePillActive: { borderColor: colors.primary, backgroundColor: colors.border },
  typePillText: { fontSize: 13, fontWeight: "700", color: colors.textMuted },
  typePillTextActive: { color: colors.primaryDark },
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
