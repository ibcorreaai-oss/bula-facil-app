import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ExplanationView } from "@/components/ExplanationView";
import { EmotionalCheckIn, Feeling } from "@/components/EmotionalCheckIn";
import { PrimaryButton } from "@/components/PrimaryButton";
import { explainPhoto, ExplainApiError } from "@/lib/api";
import { countScans, deleteOldestScansBeyond, getScan, saveScan, StoredScan } from "@/lib/db";
import { detectLanguage } from "@/lib/language";
import { takePendingPhoto } from "@/lib/pendingPhoto";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage, MedicationExplanation } from "@/lib/types";
import { FREE_HISTORY_LIMIT } from "@/lib/config";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const L: Record<ExplainLanguage, { loading: string; errorRetake: string; errorRetry: string; back: string }> = {
  pt: {
    loading: "Lendo a bula com cuidado…",
    errorRetake: "Tirar outra foto",
    errorRetry: "Tentar de novo",
    back: "Voltar ao início",
  },
  en: {
    loading: "Reading the label carefully…",
    errorRetake: "Retake photo",
    errorRetry: "Try again",
    back: "Back home",
  },
};

export default function ResultScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { historyId } = useLocalSearchParams<{ historyId?: string }>();
  const language: ExplainLanguage = detectLanguage();
  const t = L[language];

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retakePhoto, setRetakePhoto] = useState(false);
  const [explanation, setExplanation] = useState<MedicationExplanation | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (historyId) {
      setFromHistory(true);
      getScan(db, historyId).then((scan: StoredScan | null) => {
        if (!scan) {
          router.replace("/");
          return;
        }
        setPhotoUri(scan.photoUri);
        setExplanation(scan.explanation);
        setLoading(false);
      });
      return;
    }

    const uri = takePendingPhoto();
    if (!uri) {
      router.replace("/");
      return;
    }
    setPhotoUri(uri);
    runExplain(uri);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyId]);

  async function runExplain(uri: string) {
    setLoading(true);
    setError(null);
    setRetakePhoto(false);
    try {
      const result = await explainPhoto(uri, language);
      setExplanation(result);
      if (!savedRef.current) {
        savedRef.current = true;
        await saveScan(db, {
          id: generateId(),
          medicationName: result.medicationName,
          profileName: "Eu",
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
        setError(language === "pt" ? "Algo deu errado. Tente novamente." : "Something went wrong. Please try again.");
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
            onPress={() => (retakePhoto ? router.replace("/camera") : photoUri && runExplain(photoUri))}
          />
          <PrimaryButton label={t.back} onPress={() => router.replace("/")} variant="secondary" />
        </View>
      )}

      {explanation && !loading && (
        <ExplanationView
          explanation={explanation}
          language={language}
          showCheckin={feeling === "worried" || explanation.seekCareSoon}
        />
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
