import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DEFAULT_PROFILE, displayProfileName, getActiveProfile, setActiveProfile } from "@/lib/activeProfile";
import { listProfileNames } from "@/lib/db";
import { detectLanguage } from "@/lib/language";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const L: Record<ExplainLanguage, { subtitle: string; placeholder: string; add: string; premiumHint: string }> = {
  pt: {
    subtitle: "Escolha pra quem é o próximo escaneamento. Cada pessoa tem seu próprio histórico.",
    placeholder: "Nome da pessoa (ex: Mãe, Vovô)",
    add: "Adicionar",
    premiumHint: "Adicionar mais de uma pessoa é um recurso Premium.",
  },
  en: {
    subtitle: "Choose who the next scan is for. Each person keeps their own history.",
    placeholder: "Person's name (e.g. Mom, Grandpa)",
    add: "Add",
    premiumHint: "Adding more than one person is a Premium feature.",
  },
  es: {
    subtitle: "Elija para quién es el próximo escaneo. Cada persona tiene su propio historial.",
    placeholder: "Nombre de la persona (ej: Mamá, Abuelo)",
    add: "Agregar",
    premiumHint: "Agregar más de una persona es una función Premium.",
  },
  fr: {
    subtitle: "Choisissez pour qui est le prochain scan. Chaque personne a son propre historique.",
    placeholder: "Nom de la personne (ex : Maman, Papi)",
    add: "Ajouter",
    premiumHint: "Ajouter plusieurs personnes est une fonctionnalité Premium.",
  },
  zh: {
    subtitle: "选择下一次扫描是为谁进行的。每个人都有自己的历史记录。",
    placeholder: "姓名（例如：妈妈、爷爷）",
    add: "添加",
    premiumHint: "添加多位家庭成员是高级版功能。",
  },
};

export default function ProfilesScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const language = detectLanguage();
  const t = L[language];
  const [profiles, setProfiles] = useState<string[]>([DEFAULT_PROFILE]);
  const [active, setActive] = useState(DEFAULT_PROFILE);
  const [premium, setPremium] = useState(false);
  const [newName, setNewName] = useState("");

  useFocusEffect(
    useCallback(() => {
      listProfileNames(db).then(setProfiles);
      getActiveProfile().then(setActive);
      isPremium().then(setPremium);
    }, [db])
  );

  async function selectProfile(name: string) {
    if (name !== DEFAULT_PROFILE && !premium) {
      router.push("/paywall");
      return;
    }
    await setActiveProfile(name);
    setActive(name);
  }

  async function addProfile() {
    if (!premium) {
      router.push("/paywall");
      return;
    }
    const trimmed = newName.trim();
    if (!trimmed) return;
    setProfiles((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    await setActiveProfile(trimmed);
    setActive(trimmed);
    setNewName("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item}
        contentContainerStyle={{ gap: spacing.sm }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, active === item && styles.rowActive]}
            onPress={() => selectProfile(item)}
          >
            <Text style={styles.rowText}>{displayProfileName(item, language)}</Text>
            {active === item && <Text style={styles.checkmark}>✓</Text>}
            {item !== DEFAULT_PROFILE && !premium && <Text style={styles.lock}>🔒</Text>}
          </Pressable>
        )}
      />

      <View style={styles.addRow}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder={t.placeholder}
          style={styles.input}
        />
        <PrimaryButton label={t.add} onPress={addProfile} />
      </View>
      {!premium && <Text style={styles.hint}>{t.premiumHint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md },
  subtitle: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowActive: { borderColor: colors.primary, backgroundColor: colors.border },
  rowText: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },
  checkmark: { color: colors.primary, fontWeight: "900" },
  lock: { fontSize: 13 },
  addRow: { gap: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  hint: { fontSize: 12, color: colors.textMuted, textAlign: "center" },
});
