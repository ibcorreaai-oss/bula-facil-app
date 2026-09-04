import { Modal, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const L: Record<ExplainLanguage, { title: string; body1: string; body2: string; agree: string; cancel: string }> = {
  pt: {
    title: "Antes de continuar",
    body1: "Sua foto é enviada de forma segura a um serviço de inteligência artificial de terceiro (Groq) só para gerar a explicação. Ela não é salva em nossos servidores nem usada para treinar modelos de IA — depois de gerar a resposta, ela é descartada.",
    body2: "Explicare não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma condição médica. Sempre confirme com um médico ou farmacêutico.",
    agree: "Entendi, concordo",
    cancel: "Cancelar",
  },
  en: {
    title: "Before you continue",
    body1: "Your photo is securely sent to a third-party artificial intelligence service (Groq) only to generate the explanation. It is not saved on our servers or used to train any AI model — it is discarded after the response is generated.",
    body2: "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor or pharmacist.",
    agree: "I understand, I agree",
    cancel: "Cancel",
  },
  es: {
    title: "Antes de continuar",
    body1: "Su foto se envía de forma segura a un servicio de inteligencia artificial de terceros (Groq) solo para generar la explicación. No se guarda en nuestros servidores ni se usa para entrenar modelos de IA — se descarta después de generar la respuesta.",
    body2: "Explicare no es un dispositivo médico y no diagnostica, trata, cura ni previene ninguna afección médica. Confirme siempre con un médico o farmacéutico.",
    agree: "Entiendo, acepto",
    cancel: "Cancelar",
  },
  fr: {
    title: "Avant de continuer",
    body1: "Votre photo est envoyée de manière sécurisée à un service d'intelligence artificielle tiers (Groq) uniquement pour générer l'explication. Elle n'est pas conservée sur nos serveurs ni utilisée pour entraîner des modèles d'IA — elle est supprimée après la génération de la réponse.",
    body2: "Explicare n'est pas un dispositif médical et ne diagnostique, ne traite, ne guérit ni ne prévient aucune condition médicale. Confirmez toujours avec un médecin ou un pharmacien.",
    agree: "J'ai compris, j'accepte",
    cancel: "Annuler",
  },
  zh: {
    title: "继续之前",
    body1: "您的照片会安全地发送给第三方人工智能服务（Groq），仅用于生成解释。照片不会保存在我们的服务器上，也不会用于训练任何 AI 模型——生成回复后即被丢弃。",
    body2: "Explicare 不是医疗器械，不能诊断、治疗、治愈或预防任何疾病。请务必咨询执业医生或药剂师。",
    agree: "我已了解，同意",
    cancel: "取消",
  },
};

export function ConsentModal({
  visible,
  onAgree,
  onCancel,
  language,
}: {
  visible: boolean;
  onAgree: () => void;
  onCancel: () => void;
  language: ExplainLanguage;
}) {
  const t = L[language];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.body}>{t.body1}</Text>
          <Text style={styles.body}>{t.body2}</Text>
          <PrimaryButton label={t.agree} onPress={onAgree} />
          <PrimaryButton label={t.cancel} onPress={onCancel} variant="secondary" />
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
