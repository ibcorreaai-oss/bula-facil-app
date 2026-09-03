import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { isPurchasesAvailable, presentPaywall } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";

const FEATURES = [
  "Histórico ilimitado de remédios explicados",
  "Perfis separados pra cada pessoa da família",
  "Lembretes de horário do remédio",
  "Checagem de interação entre remédios que você já tomou",
];

export default function PaywallScreen() {
  const router = useRouter();
  const [available, setAvailable] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    setAvailable(isPurchasesAvailable());
  }, []);

  async function handleSubscribe() {
    setPurchasing(true);
    try {
      const purchased = await presentPaywall();
      if (purchased) router.back();
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bula Fácil Premium</Text>
      <Text style={styles.subtitle}>
        O escaneamento e a explicação de segurança são e sempre serão grátis. Premium desbloqueia
        organização pra cuidar de mais de uma pessoa:
      </Text>

      <View style={styles.list}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {available ? (
        <PrimaryButton label={purchasing ? "Abrindo…" : "Ver planos"} onPress={handleSubscribe} loading={purchasing} />
      ) : (
        <View style={styles.comingSoon}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.comingSoonText}>Assinatura chegando em breve — as funções grátis já funcionam normalmente.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.bg, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "900", color: colors.text, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", lineHeight: 20 },
  list: { gap: spacing.sm },
  featureRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  checkmark: { color: colors.primary, fontWeight: "900", fontSize: 16 },
  featureText: { flex: 1, fontSize: 15, color: colors.text },
  comingSoon: {
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  comingSoonText: { fontSize: 13, color: colors.textMuted, textAlign: "center" },
});
