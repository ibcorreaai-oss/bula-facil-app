import { Modal, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { colors, radius, spacing } from "@/lib/theme";

export function ConsentModal({ visible, onAgree, onCancel }: { visible: boolean; onAgree: () => void; onCancel: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Antes de continuar</Text>
          <Text style={styles.body}>
            Sua foto é enviada de forma segura a um serviço de inteligência artificial de
            terceiro (Groq) só para gerar a explicação. Ela não é salva em nossos servidores nem
            usada para treinar modelos de IA — depois de gerar a resposta, ela é descartada.
          </Text>
          <Text style={styles.body}>
            Bula Fácil não é um dispositivo médico e não diagnostica, trata, cura ou previne
            nenhuma condição médica. Sempre confirme com um médico ou farmacêutico.
          </Text>
          <PrimaryButton label="Entendi, concordo" onPress={onAgree} />
          <PrimaryButton label="Cancelar" onPress={onCancel} variant="secondary" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,22,0.6)", alignItems: "center", justifyContent: "center", padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    width: "100%",
    maxWidth: 420,
  },
  title: { fontSize: 18, fontWeight: "800", color: colors.text, textAlign: "center" },
  body: { fontSize: 14, color: colors.text, lineHeight: 20 },
});
