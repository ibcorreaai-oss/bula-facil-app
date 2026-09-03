import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const TITLE: Record<ExplainLanguage, string> = { pt: "Confirme que você entendeu", en: "Confirm you understood" };
const ALL_DONE: Record<ExplainLanguage, string> = {
  pt: "Você confirmou os pontos mais importantes. 👍",
  en: "You've confirmed the most important points. 👍",
};

export function KeyPointsChecklist({ points, language }: { points: string[]; language: ExplainLanguage }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  function toggle(index: number) {
    Haptics.selectionAsync().catch(() => {});
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  const allChecked = points.length > 0 && points.every((_, i) => checked[i]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TITLE[language]}</Text>
      {points.map((point, i) => (
        <Pressable key={i} onPress={() => toggle(i)} style={styles.row}>
          <View style={[styles.checkbox, checked[i] && styles.checkboxChecked]}>
            {checked[i] && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.pointText, checked[i] && styles.pointTextChecked]}>{point}</Text>
        </Pressable>
      ))}
      {allChecked && <Text style={styles.doneText}>{ALL_DONE[language]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { fontSize: 15, fontWeight: "800", color: colors.text, marginBottom: spacing.xs },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.xs },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: colors.primary },
  checkmark: { color: colors.onPrimary, fontSize: 14, fontWeight: "800" },
  pointText: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 21 },
  pointTextChecked: { color: colors.textMuted, textDecorationLine: "line-through" },
  doneText: { fontSize: 13, color: colors.success, fontWeight: "700", marginTop: spacing.xs },
});
