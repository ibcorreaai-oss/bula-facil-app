import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { API_BASE_URL } from "@/lib/config";
import { colors, radius, spacing } from "@/lib/theme";

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Privacidade</Text>
        <Text style={styles.bodyText}>
          Suas fotos são analisadas apenas para gerar a explicação e não ficam guardadas em
          nenhum servidor. Seu histórico fica salvo só neste aparelho.
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL(`${API_BASE_URL}/privacy`)}>
          Ler a política de privacidade completa →
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.bodyText}>
          Bula Fácil não é um dispositivo médico e não diagnostica, trata, cura ou previne
          nenhuma condição médica. As explicações são geradas por inteligência artificial e são
          um resumo educativo em linguagem simples — não substituem a orientação de um médico ou
          farmacêutico.
        </Text>
        <Text style={styles.bodyText}>Versão {Constants.expoConfig?.version ?? "1.0.0"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <Text style={styles.link} onPress={() => Linking.openURL("mailto:cortextechbr@gmail.com")}>
          cortextechbr@gmail.com
        </Text>
      </View>

      <Text style={styles.footer}>Um produto Cortex Tech</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.bg, flexGrow: 1 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: colors.primaryDark, textTransform: "uppercase" },
  bodyText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  link: { fontSize: 14, color: colors.primary, fontWeight: "700", marginTop: spacing.xs },
  footer: { textAlign: "center", color: colors.textMuted, fontSize: 12, marginTop: spacing.lg },
});
