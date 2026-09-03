import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

export type Feeling = "worried" | "unsure" | "calm";

const OPTIONS: { value: Feeling; emoji: string; pt: string; en: string }[] = [
  { value: "worried", emoji: "😟", pt: "Preocupado", en: "Worried" },
  { value: "unsure", emoji: "😐", pt: "Não sei", en: "Not sure" },
  { value: "calm", emoji: "🙂", pt: "Tranquilo", en: "Calm" },
];

const COPY: Record<ExplainLanguage, { question: string; note: string }> = {
  pt: {
    question: "Opcional — como você está se sentindo esperando essa explicação?",
    note: "Isso fica só no seu aparelho. Não é enviado a lugar nenhum, só muda como mostramos o resultado.",
  },
  en: {
    question: "Optional — how are you feeling while you wait for this explanation?",
    note: "This stays on your device only. It isn't sent anywhere, it only changes how the result is shown.",
  },
};

export function EmotionalCheckIn({
  value,
  onChange,
  language,
}: {
  value: Feeling | null;
  onChange: (v: Feeling) => void;
  language: ExplainLanguage;
}) {
  const t = COPY[language];
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{t.question}</Text>
      <Text style={styles.note}>{t.note}</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.option, value === opt.value && styles.optionSelected]}
          >
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <Text style={[styles.optionText, value === opt.value && styles.optionTextSelected]}>
              {language === "pt" ? opt.pt : opt.en}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  question: { fontSize: 14, fontWeight: "700", color: colors.text },
  note: { fontSize: 12, color: colors.textMuted },
  row: { flexDirection: "row", gap: spacing.sm },
  option: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    gap: 2,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.border },
  emoji: { fontSize: 20 },
  optionText: { fontSize: 12, fontWeight: "600", color: colors.textMuted },
  optionTextSelected: { color: colors.primaryDark },
});
