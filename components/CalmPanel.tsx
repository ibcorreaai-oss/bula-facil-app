import { StyleSheet, Text, View } from "react-native";
import { BreathingPacer } from "./BreathingPacer";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const COPY: Record<ExplainLanguage, { title: string; in: string; out: string; act: string; actBody: string }> = {
  pt: { title: "Um momento antes dos detalhes", in: "Inspire devagar…", out: "Solte o ar devagar…", act: "Vale agir:", actBody: "com base nessa bula, é melhor falar com um médico ou farmacêutico em breve — não é uma emergência, só algo pra não deixar pra depois." },
  en: { title: "A moment before the details", in: "Breathe in slowly…", out: "Breathe out slowly…", act: "Worth acting on:", actBody: "based on this label, it's a good idea to talk to a doctor or pharmacist soon — not an emergency, just something not to put off." },
  es: { title: "Un momento antes de los detalles", in: "Inspire despacio…", out: "Suelte el aire despacio…", act: "Vale la pena actuar:", actBody: "según esta etiqueta, es buena idea hablar con un médico o farmacéutico pronto — no es una emergencia, solo algo que no conviene dejar pasar." },
  fr: { title: "Un instant avant les détails", in: "Inspirez lentement…", out: "Expirez lentement…", act: "À ne pas négliger :", actBody: "d'après cette notice, il est conseillé de parler bientôt à un médecin ou un pharmacien — ce n'est pas une urgence, juste quelque chose à ne pas remettre à plus tard." },
  zh: { title: "查看详情前，先停一下", in: "缓缓吸气…", out: "缓缓呼气…", act: "值得留意：", actBody: "根据这份标签，建议尽快和医生或药剂师聊聊——这不是紧急情况，只是不该拖延的事。" },
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
