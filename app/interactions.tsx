import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { PrimaryButton } from "@/components/PrimaryButton";
import { getActiveProfile } from "@/lib/activeProfile";
import { listMedicationNamesForProfile } from "@/lib/db";
import { detectLanguage } from "@/lib/language";
import { checkInteractions, InteractionCheckResult } from "@/lib/interactions";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const SEVERITY_COLOR = { minor: colors.primary, moderate: colors.warning, serious: colors.danger };

const L: Record<
  ExplainLanguage,
  {
    empty: string;
    subtitle: string;
    verifying: string;
    verify: string;
    minSelection: string;
    genericError: string;
    demo: string;
  }
> = {
  pt: {
    empty: "Escaneie pelo menos 2 remédios diferentes pra essa pessoa antes de checar interações.",
    subtitle: "Selecione os remédios que quer checar juntos:",
    verifying: "Verificando…",
    verify: "Verificar interações",
    minSelection: "Selecione pelo menos 2 remédios.",
    genericError: "Algo deu errado.",
    demo: "Modo demonstração",
  },
  en: {
    empty: "Scan at least 2 different medications for this person before checking interactions.",
    subtitle: "Select the medications you want to check together:",
    verifying: "Checking…",
    verify: "Check interactions",
    minSelection: "Select at least 2 medications.",
    genericError: "Something went wrong.",
    demo: "Demo mode",
  },
  es: {
    empty: "Escanee al menos 2 medicamentos diferentes para esta persona antes de verificar interacciones.",
    subtitle: "Seleccione los medicamentos que quiere verificar juntos:",
    verifying: "Verificando…",
    verify: "Verificar interacciones",
    minSelection: "Seleccione al menos 2 medicamentos.",
    genericError: "Algo salió mal.",
    demo: "Modo demostración",
  },
  fr: {
    empty: "Scannez au moins 2 médicaments différents pour cette personne avant de vérifier les interactions.",
    subtitle: "Sélectionnez les médicaments à vérifier ensemble :",
    verifying: "Vérification…",
    verify: "Vérifier les interactions",
    minSelection: "Sélectionnez au moins 2 médicaments.",
    genericError: "Une erreur s'est produite.",
    demo: "Mode démo",
  },
  zh: {
    empty: "请先为该成员扫描至少 2 种不同的药物，再检查相互作用。",
    subtitle: "选择您想一起检查的药物：",
    verifying: "正在检查…",
    verify: "检查相互作用",
    minSelection: "请至少选择 2 种药物。",
    genericError: "出了点问题。",
    demo: "演示模式",
  },
};

export default function InteractionsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const language = detectLanguage();
  const t = L[language];
  const [names, setNames] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InteractionCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const profile = await getActiveProfile();
        const list = await listMedicationNamesForProfile(db, profile);
        setNames(list);
        setSelected(new Set(list));
        setPremium(await isPremium());
      })();
    }, [db])
  );

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  async function run() {
    if (!premium) {
      router.push("/paywall");
      return;
    }
    const chosen = Array.from(selected);
    if (chosen.length < 2) {
      setError(t.minSelection);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await checkInteractions(chosen, language);
      setResult(r);
    } catch (err: any) {
      setError(err?.message ?? t.genericError);
    } finally {
      setLoading(false);
    }
  }

  if (names.length < 2) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t.empty}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>{t.subtitle}</Text>
      {names.map((name) => (
        <Pressable key={name} onPress={() => toggle(name)} style={styles.checkRow}>
          <View style={[styles.checkbox, selected.has(name) && styles.checkboxChecked]}>
            {selected.has(name) && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>{name}</Text>
        </Pressable>
      ))}

      <PrimaryButton label={loading ? t.verifying : t.verify} onPress={run} loading={loading} />
      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && (
        <View style={styles.resultCard}>
          {result.isDemo && <Text style={styles.demoText}>{t.demo}</Text>}
          <Text style={styles.summary}>{result.summary}</Text>
          {result.pairs.map((pair, i) => (
            <View key={i} style={[styles.pairRow, { borderLeftColor: SEVERITY_COLOR[pair.severity] }]}>
              <Text style={styles.pairTitle}>{pair.medications.join(" + ")}</Text>
              <Text style={styles.pairNote}>{pair.note}</Text>
            </View>
          ))}
          <Text style={styles.disclaimer}>{result.disclaimer}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.bg, flexGrow: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg, padding: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: 15, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.xs },
  checkRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: colors.primary },
  checkmark: { color: colors.onPrimary, fontSize: 13, fontWeight: "800" },
  checkLabel: { fontSize: 15, color: colors.text, flex: 1 },
  errorText: { color: colors.danger, fontSize: 13, textAlign: "center" },
  resultCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  demoText: { color: colors.warning, fontSize: 12, fontWeight: "700" },
  summary: { fontSize: 15, color: colors.text, lineHeight: 21 },
  pairRow: { borderLeftWidth: 3, paddingLeft: spacing.sm, gap: 2 },
  pairTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  pairNote: { fontSize: 13, color: colors.textMuted },
  disclaimer: { fontSize: 12, color: colors.textMuted, fontStyle: "italic", textAlign: "center" },
});
