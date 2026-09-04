import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

export type Feeling = "worried" | "unsure" | "calm";

const OPTIONS: { value: Feeling; emoji: string; label: Record<ExplainLanguage, string> }[] = [
  { value: "worried", emoji: "😟", label: { pt: "Preocupado", en: "Worried", es: "Preocupado", fr: "Inquiet", zh: "担心" } },
  { value: "unsure", emoji: "😐", label: { pt: "Não sei", en: "Not sure", es: "No lo sé", fr: "Pas sûr", zh: "不确定" } },
  { value: "calm", emoji: "🙂", label: { pt: "Tranquilo", en: "Calm", es: "Tranquilo", fr: "Calme", zh: "还好" } },
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
  es: {
    question: "Opcional — ¿cómo se siente mientras espera esta explicación?",
    note: "Esto queda solo en su dispositivo. No se envía a ningún lugar, solo cambia cómo mostramos el resultado.",
  },
  fr: {
    question: "Facultatif — comment vous sentez-vous en attendant cette explication ?",
    note: "Cela reste uniquement sur votre appareil. Ce n'est envoyé nulle part, cela change seulement la façon dont le résultat est présenté.",
  },
  zh: {
    question: "可选 — 等待这份解释时，您感觉如何？",
    note: "这项信息只保存在您的设备上，不会发送到任何地方，只会影响结果的呈现方式。",
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
              {opt.label[language]}
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
