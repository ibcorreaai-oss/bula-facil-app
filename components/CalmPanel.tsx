import { StyleSheet, Text, View } from "react-native";
import { BreathingPacer } from "./BreathingPacer";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const COPY: Record<ExplainLanguage, { title: string; in: string; out: string; act: string; actBody: string }> = {
  pt: { title: "Um momento antes dos detalhes", in: "Inspire devagar…", out: "Solte o ar devagar…", act: "Vale agir:", actBody: "com base nessa bula, é melhor falar com um médico ou farmacêutico em breve — não é uma emergência, só algo pra não deixar pra depois." },
  en: { title: "A moment before the details", in: "Breathe in slowly…", out: "Breathe out slowly…", act: "Worth acting on:", actBody: "based on this label, it's a good idea to talk to a doctor or pharmacist soon — not an emergency, just something not to put off." },
};

export function CalmPanel({
  reassurance,
  seekCareSoon,
  language,
}: {
  reassurance: string;
  seekCareSoon: boolean;
  language: ExplainLanguage;
}) {
  const copy = COPY[language];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{copy.title}</Text>
      <BreathingPacer inLabel={copy.in} outLabel={copy.out} />
      <Text style={styles.reassurance}>{reassurance}</Text>
      {seekCareSoon && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>{copy.act} </Text>
            {copy.actBody}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0FDFA",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { fontSize: 14, fontWeight: "700", color: colors.primaryDark },
  reassurance: { fontSize: 14, color: colors.text, lineHeight: 20 },
  warningBox: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  warningText: { fontSize: 13, color: colors.warning, lineHeight: 18 },
  warningBold: { fontWeight: "800" },
});
