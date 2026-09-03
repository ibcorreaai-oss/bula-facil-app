import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DEFAULT_PROFILE, getActiveProfile, setActiveProfile } from "@/lib/activeProfile";
import { listProfileNames } from "@/lib/db";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";

export default function ProfilesScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
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
      <Text style={styles.subtitle}>
        Escolha pra quem é o próximo escaneamento. Cada pessoa tem seu próprio histórico.
      </Text>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item}
        contentContainerStyle={{ gap: spacing.sm }}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, active === item && styles.rowActive]}
            onPress={() => selectProfile(item)}
          >
            <Text style={styles.rowText}>{item}</Text>
            {active === item && <Text style={styles.checkmark}>✓</Text>}
            {item !== DEFAULT_PROFILE && !premium && <Text style={styles.lock}>🔒</Text>}
          </Pressable>
        )}
      />

      <View style={styles.addRow}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="Nome da pessoa (ex: Mãe, Vovô)"
          style={styles.input}
        />
        <PrimaryButton label="Adicionar" onPress={addProfile} />
      </View>
      {!premium && (
        <Text style={styles.hint}>Adicionar mais de uma pessoa é um recurso Premium.</Text>
      )}
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
