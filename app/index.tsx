import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";
import { PrimaryButton } from "@/components/PrimaryButton";
import { countScans } from "@/lib/db";
import { getActiveProfile } from "@/lib/activeProfile";
import { setPendingPhoto } from "@/lib/pendingPhoto";
import { colors, radius, spacing } from "@/lib/theme";

export default function Home() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [scanCount, setScanCount] = useState(0);
  const [activeProfile, setActiveProfileState] = useState("Eu");

  useFocusEffect(
    useCallback(() => {
      countScans(db).then(setScanCount);
      getActiveProfile().then(setActiveProfileState);
    }, [db])
  );

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
        <Text style={styles.badgeText}>💊 Grátis · Não é orientação médica</Text>
      </View>
      <Text style={styles.title}>Bula Fácil</Text>
      <Pressable style={styles.profilePill} onPress={() => router.push("/profiles")}>
        <Text style={styles.profilePillText}>👤 Escaneando para: {activeProfile}</Text>
      </Pressable>
      <Text style={styles.subtitle}>
        Fotografe uma bula, caixa de remédio ou receita e entenda em poucos segundos, em linguagem
        simples.
      </Text>

      <Pressable style={styles.cameraCard} onPress={() => router.push("/camera")}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraCardTitle}>Fotografar agora</Text>
        <Text style={styles.cameraCardSubtitle}>Aponte a câmera pra bula, caixa ou receita</Text>
      </Pressable>

      <PrimaryButton label="Escolher foto da galeria" onPress={pickFromGallery} variant="secondary" />

      <View style={styles.row}>
        <Pressable style={styles.linkCard} onPress={() => router.push("/history")}>
          <Text style={styles.linkIcon}>🗂️</Text>
          <Text style={styles.linkText}>Histórico{scanCount > 0 ? ` (${scanCount})` : ""}</Text>
        </Pressable>
        <Pressable style={styles.linkCard} onPress={() => router.push("/settings")}>
          <Text style={styles.linkIcon}>⚙️</Text>
          <Text style={styles.linkText}>Ajustes</Text>
        </Pressable>
      </View>

      <Pressable style={styles.premiumBanner} onPress={() => router.push("/paywall")}>
        <Text style={styles.premiumText}>
          ✨ Bula Fácil Premium — histórico ilimitado, lembretes e perfis da família
        </Text>
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
