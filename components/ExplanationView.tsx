import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { CalmPanel } from "./CalmPanel";
import { KeyPointsChecklist } from "./KeyPointsChecklist";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage, MedicationExplanation, SideEffect } from "@/lib/types";

interface Copy {
  demo: string;
  summary: string;
  readAloud: string;
  stop: string;
  howToTake: string;
  sideEffects: string;
  common: string;
  serious: string;
  warnings: string;
  questions: string;
}

const L: Record<ExplainLanguage, Copy> = {
  pt: {
    demo: "Modo demonstração — configure a chave de IA no servidor pra respostas reais.",
    summary: "Resumo",
    readAloud: "Ouvir",
    stop: "Parar",
    howToTake: "Como tomar",
    sideEffects: "Efeitos possíveis",
    common: "comum",
    serious: "sério",
    warnings: "Atenção",
    questions: "Perguntas pro médico ou farmacêutico",
  },
  en: {
    demo: "Demo mode — configure the AI key on the server for real answers.",
    summary: "Summary",
    readAloud: "Read aloud",
    stop: "Stop",
    howToTake: "How to take it",
    sideEffects: "Possible side effects",
    common: "common",
    serious: "serious",
    warnings: "Watch out for",
    questions: "Questions for your doctor or pharmacist",
  },
};

export function ExplanationView({
  explanation,
  language,
  showCheckin,
}: {
  explanation: MedicationExplanation;
  language: ExplainLanguage;
  /** Whether the calming panel should render (worried check-in OR the AI itself flagged seekCareSoon). */
  showCheckin: boolean;
}) {
  const t = L[language];
  const [isReading, setIsReading] = useState(false);

  function toggleReadAloud() {
    if (isReading) {
      Speech.stop();
      setIsReading(false);
      return;
    }
    const text = [explanation.summary, explanation.howToTake].join(". ");
    Speech.speak(text, {
      language: language === "pt" ? "pt-BR" : "en-US",
      onDone: () => setIsReading(false),
      onStopped: () => setIsReading(false),
      onError: () => setIsReading(false),
    });
    setIsReading(true);
  }

  return (
    <View style={{ gap: spacing.md }}>
      {explanation.isDemo && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoText}>{t.demo}</Text>
        </View>
      )}

      {showCheckin && (
        <CalmPanel reassurance={explanation.reassurance} seekCareSoon={explanation.seekCareSoon} language={language} />
      )}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.medicationName}>{explanation.medicationName}</Text>
          <Pressable onPress={toggleReadAloud} style={styles.readAloudButton}>
            <Text style={styles.readAloudText}>{isReading ? `⏹ ${t.stop}` : `🔊 ${t.readAloud}`}</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionLabel}>{t.summary}</Text>
        <Text style={styles.bodyText}>{explanation.summary}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t.howToTake}</Text>
        <Text style={styles.bodyText}>{explanation.howToTake}</Text>
      </View>

      <KeyPointsChecklist points={explanation.keyPointsToConfirm} language={language} />

      {explanation.sideEffects.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t.sideEffects}</Text>
          {explanation.sideEffects.map((s: SideEffect, i: number) => (
            <View key={i} style={styles.effectRow}>
              <View style={[styles.dot, s.severity === "serious" ? styles.dotSerious : styles.dotCommon]} />
              <Text style={styles.bodyText}>
                {s.name} <Text style={styles.severityTag}>({s.severity === "serious" ? t.serious : t.common})</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      {explanation.warnings.length > 0 && (
        <View style={[styles.card, styles.warningCard]}>
          <Text style={styles.sectionLabel}>{t.warnings}</Text>
          {explanation.warnings.map((w: string, i: number) => (
            <Text key={i} style={styles.bodyText}>
              • {w}
            </Text>
          ))}
        </View>
      )}

      {explanation.questionsForDoctor.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t.questions}</Text>
          {explanation.questionsForDoctor.map((q: string, i: number) => (
            <Text key={i} style={styles.bodyText}>
              • {q}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.disclaimer}>{explanation.disclaimer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  demoBanner: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  demoText: { color: colors.warning, fontSize: 13 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  warningCard: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  medicationName: { fontSize: 19, fontWeight: "800", color: colors.text, flexShrink: 1 },
  readAloudButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  readAloudText: { fontSize: 12, fontWeight: "700", color: colors.primaryDark },
  sectionLabel: { fontSize: 13, fontWeight: "800", color: colors.primaryDark, textTransform: "uppercase", letterSpacing: 0.4 },
  bodyText: { fontSize: 15, color: colors.text, lineHeight: 21 },
  effectRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotCommon: { backgroundColor: colors.primary },
  dotSerious: { backgroundColor: colors.danger },
  severityTag: { fontSize: 12, color: colors.textMuted },
  disclaimer: { fontSize: 12, color: colors.textMuted, fontStyle: "italic", textAlign: "center", paddingHorizontal: spacing.md },
});
