import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ExplanationView } from "@/components/ExplanationView";
import { LabResultView } from "@/components/LabResultView";
import { EmotionalCheckIn, Feeling } from "@/components/EmotionalCheckIn";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ReminderControl } from "@/components/ReminderControl";
import { explainLabPhoto, explainPhoto, ExplainApiError } from "@/lib/api";
import { getActiveProfile } from "@/lib/activeProfile";
import { countScans, deleteOldestScansBeyond, getScan, saveScan, StoredScan } from "@/lib/db";
import { detectLanguage } from "@/lib/language";
import { takePendingPhoto } from "@/lib/pendingPhoto";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";
import { DocumentType, ExplainLanguage, LabExplanation, MedicationExplanation } from "@/lib/types";
import { FREE_HISTORY_LIMIT } from "@/lib/config";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const L: Record<
  ExplainLanguage,
  { loading: string; errorRetake: string; errorRetry: string; back: string; genericError: string }
> = {
  pt: {
    loading: "Lendo com cuidado…",
    errorRetake: "Tirar outra foto",
    errorRetry: "Tentar de novo",
    back: "Voltar ao início",
    genericError: "Algo deu errado. Tente novamente.",
  },
  en: {
    loading: "Reading carefully…",
    errorRetake: "Retake photo",
    errorRetry: "Try again",
    back: "Back home",
    genericError: "Something went wrong. Please try again.",
  },
  es: {
    loading: "Leyendo con cuidado…",
    errorRetake: "Tomar otra foto",
    errorRetry: "Intentar de nuevo",
    back: "Volver al inicio",
    genericError: "Algo salió mal. Inténtelo de nuevo.",
  },
  fr: {
    loading: "Lecture en cours…",
    errorRetake: "Reprendre la photo",
    errorRetry: "Réessayer",
    back: "Retour à l'accueil",
    genericError: "Une erreur s'est produite. Veuillez réessayer.",
  },
  zh: {
    loading: "正在仔细读取…",
    errorRetake: "重新拍照",
    errorRetry: "重试",
    back: "返回首页",
    genericError: "出了点问题。请再试一次。",
  },
};

type Explanation = MedicationExplanation | LabExplanation;

export default function ResultScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { historyId } = useLocalSearchParams<{ historyId?: string }>();
  const language: ExplainLanguage = detectLanguage();
  const t = L[language];

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("medication");
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retakePhoto, setRetakePhoto] = useState(false);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [reminder, setReminderState] = useState<{ id: string | null; hour: number | null }>({ id: null, hour: null });
  const savedRef = useRef(false);

  function refreshReminder(id: string) {
    getScan(db, id).then((scan: StoredScan | null) => {
      if (scan) setReminderState({ id: scan.reminderNotificationId, hour: scan.reminderHour });
    });
  }

  useEffect(() => {
    if (historyId) {
      setFromHistory(true);
      setScanId(historyId);
      setExplanation(null);
      setLoading(true);
      getScan(db, historyId).then((scan: StoredScan | null) => {
        if (!scan) {
          router.replace("/");
          return;
        }
        setPhotoUri(scan.photoUri);
        setDocumentType(scan.documentType);
        setExplanation(scan.explanation);
        setReminderState({ id: scan.reminderNotificationId, hour: scan.reminderHour });
        setLoading(false);
      });
      return;
    }

    const pending = takePendingPhoto();
    if (!pending) {
      router.replace("/");
      return;
    }
    setPhotoUri(pending.uri);
    setDocumentType(pending.documentType);
    runExplain(pending.uri, pending.documentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyId]);

  async function runExplain(uri: string, type: DocumentType) {
    setLoading(true);
    setError(null);
    setRetakePhoto(false);
    try {
      const result = type === "lab" ? await explainLabPhoto(uri, language) : await explainPhoto(uri, language);
      setExplanation(result);
      if (!savedRef.current) {
        savedRef.current = true;
        const id = generateId();
        setScanId(id);
        const profileName = await getActiveProfile();
        const title = type === "lab" ? (result as LabExplanation).examTitle : (result as MedicationExplanation).medicationName;
        await saveScan(db, {
          id,
          documentType: type,
          medicationName: title,
          profileName,
          photoUri: uri,
          explanation: result,
        });
        const premium = await isPremium();
        if (!premium) {
          const total = await countScans(db);
          if (total > FREE_HISTORY_LIMIT) {
            await deleteOldestScansBeyond(db, FREE_HISTORY_LIMIT);
          }
        }
      }
    } catch (err) {
      if (err instanceof ExplainApiError) {
        setError(err.message);
        setRetakePhoto(err.retakePhoto);
      } else {
        setError(t.genericError);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {photoUri && !fromHistory && (
        <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
      )}

      {!fromHistory && !explanation && (
        <EmotionalCheckIn value={feeling} onChange={setFeeling} language={language} />
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton
            label={retakePhoto ? t.errorRetake : t.errorRetry}
            onPress={() => (retakePhoto ? router.replace("/camera") : photoUri && runExplain(photoUri, documentType))}
          />
          <PrimaryButton label={t.back} onPress={() => router.replace("/")} variant="secondary" />
        </View>
      )}

      {explanation && !loading && documentType === "lab" && (
        <LabResultView
          explanation={explanation as LabExplanation}
          language={language}
          showCheckin={feeling === "worried" || explanation.seekCareSoon}
        />
      )}

      {explanation && !loading && documentType === "medication" && (
        <>
          <ExplanationView
            explanation={explanation as MedicationExplanation}
            language={language}
            showCheckin={feeling === "worried" || explanation.seekCareSoon}
          />
          {scanId && (
            <ReminderControl
              scanId={scanId}
              medicationName={(explanation as MedicationExplanation).medicationName}
              reminderNotificationId={reminder.id}
              reminderHour={reminder.hour}
              onChanged={() => refreshReminder(scanId)}
            />
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.bg, flexGrow: 1 },
  photoPreview: { width: "100%", height: 160, borderRadius: radius.lg },
  loadingBox: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xl },
  loadingText: { color: colors.textMuted, fontSize: 14 },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  errorText: { color: colors.danger, fontSize: 14, textAlign: "center" },
});
