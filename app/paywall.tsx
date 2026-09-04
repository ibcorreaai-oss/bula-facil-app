import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { detectLanguage } from "@/lib/language";
import { isPurchasesAvailable, presentPaywall } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const L: Record<
  ExplainLanguage,
  { title: string; subtitle: string; features: string[]; viewPlans: string; opening: string; comingSoon: string }
> = {
  pt: {
    title: "Explicare Premium",
    subtitle: "O escaneamento e a explicação de segurança são e sempre serão grátis. Premium desbloqueia organização pra cuidar de mais de uma pessoa:",
    features: [
      "Histórico ilimitado de itens explicados",
      "Perfis separados pra cada pessoa da família",
      "Lembretes de horário do remédio",
      "Checagem de interação entre remédios que você já tomou",
    ],
    viewPlans: "Ver planos",
    opening: "Abrindo…",
    comingSoon: "Assinatura chegando em breve — as funções grátis já funcionam normalmente.",
  },
  en: {
    title: "Explicare Premium",
    subtitle: "Scanning and the safety explanation are, and always will be, free. Premium unlocks organization for taking care of more than one person:",
    features: [
      "Unlimited history of explained items",
      "Separate profile for each family member",
      "Medication time reminders",
      "Interaction check between medications you already take",
    ],
    viewPlans: "View plans",
    opening: "Opening…",
    comingSoon: "Subscriptions coming soon — the free features already work normally.",
  },
  es: {
    title: "Explicare Premium",
    subtitle: "El escaneo y la explicación de seguridad son y siempre serán gratis. Premium desbloquea organización para cuidar a más de una persona:",
    features: [
      "Historial ilimitado de elementos explicados",
      "Perfil separado para cada persona de la familia",
      "Recordatorios de horario del medicamento",
      "Verificación de interacción entre medicamentos que ya toma",
    ],
    viewPlans: "Ver planes",
    opening: "Abriendo…",
    comingSoon: "La suscripción llega pronto — las funciones gratis ya funcionan normalmente.",
  },
  fr: {
    title: "Explicare Premium",
    subtitle: "Le scan et l'explication de sécurité sont, et resteront toujours, gratuits. Premium permet de s'organiser pour prendre soin de plusieurs personnes :",
    features: [
      "Historique illimité des éléments expliqués",
      "Profil séparé pour chaque membre de la famille",
      "Rappels d'horaire de médicament",
      "Vérification d'interaction entre médicaments déjà pris",
    ],
    viewPlans: "Voir les offres",
    opening: "Ouverture…",
    comingSoon: "L'abonnement arrive bientôt — les fonctions gratuites fonctionnent déjà normalement.",
  },
  zh: {
    title: "Explicare 高级版",
    subtitle: "扫描和安全解释永远免费。高级版可帮您组织和照顾多位家庭成员：",
    features: [
      "无限历史记录",
      "每位家庭成员独立档案",
      "用药时间提醒",
      "检查已服用药物之间的相互作用",
    ],
    viewPlans: "查看方案",
    opening: "正在打开…",
    comingSoon: "订阅功能即将上线 — 免费功能已可正常使用。",
  },
};

export default function PaywallScreen() {
  const router = useRouter();
  const t = L[detectLanguage()];
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
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <View style={styles.list}>
        {t.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {available ? (
        <PrimaryButton label={purchasing ? t.opening : t.viewPlans} onPress={handleSubscribe} loading={purchasing} />
      ) : (
        <View style={styles.comingSoon}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.comingSoonText}>{t.comingSoon}</Text>
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
