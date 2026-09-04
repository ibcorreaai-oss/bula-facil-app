import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { detectLanguage } from "@/lib/language";
import { setPendingPhoto } from "@/lib/pendingPhoto";
import { colors, radius, spacing } from "@/lib/theme";
import { DocumentType, ExplainLanguage } from "@/lib/types";

const L: Record<ExplainLanguage, { permission: string; allow: string; cancel: string; frameHint: string }> = {
  pt: {
    permission: "Precisamos da câmera pra fotografar a bula, receita ou exame.",
    allow: "Permitir câmera",
    cancel: "Cancelar",
    frameHint: "Centralize o documento no quadro",
  },
  en: {
    permission: "We need the camera to photograph the label, prescription, or lab result.",
    allow: "Allow camera",
    cancel: "Cancel",
    frameHint: "Center the document in the frame",
  },
  es: {
    permission: "Necesitamos la cámara para fotografiar la etiqueta, receta o resultado.",
    allow: "Permitir cámara",
    cancel: "Cancelar",
    frameHint: "Centre el documento en el cuadro",
  },
  fr: {
    permission: "Nous avons besoin de la caméra pour photographier l'étiquette, l'ordonnance ou le résultat.",
    allow: "Autoriser la caméra",
    cancel: "Annuler",
    frameHint: "Centrez le document dans le cadre",
  },
  zh: {
    permission: "我们需要使用相机拍摄标签、处方或化验单。",
    allow: "允许使用相机",
    cancel: "取消",
    frameHint: "请将文件对准框内居中",
  },
};

export default function CameraScreen() {
  const router = useRouter();
  const { documentType: documentTypeParam } = useLocalSearchParams<{ documentType?: string }>();
  const documentType: DocumentType = documentTypeParam === "lab" ? "lab" : "medication";
  const language = detectLanguage();
  const t = L[language];
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  async function capture() {
    if (!cameraRef.current || !ready || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) {
        setPendingPhoto(photo.uri, documentType);
        router.replace("/result");
      }
    } finally {
      setCapturing(false);
    }
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>{t.permission}</Text>
        <PrimaryButton label={t.allow} onPress={requestPermission} />
        <PrimaryButton label={t.cancel} onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        onCameraReady={() => setReady(true)}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.frameHint}>
          <Text style={styles.frameHintText}>{t.frameHint}</Text>
        </View>
        <View style={styles.controlsRow}>
          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>{t.cancel}</Text>
          </Pressable>
          <Pressable onPress={capture} disabled={!ready || capturing} style={styles.shutterOuter}>
            <View style={[styles.shutterInner, capturing && { opacity: 0.5 }]} />
          </Pressable>
          <View style={styles.cancelButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  centered: { alignItems: "center", justifyContent: "center", gap: spacing.md, padding: spacing.lg },
  permissionText: { color: colors.text, fontSize: 16, textAlign: "center" },
  overlay: { flex: 1, justifyContent: "space-between", paddingTop: 64, paddingBottom: spacing.xl },
  frameHint: { alignSelf: "center", backgroundColor: "rgba(0,0,0,0.55)", borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  frameHintText: { color: "white", fontSize: 13, fontWeight: "600" },
  controlsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl },
  cancelButton: { width: 72, alignItems: "center" },
  cancelText: { color: "white", fontSize: 15, fontWeight: "600" },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },
});
