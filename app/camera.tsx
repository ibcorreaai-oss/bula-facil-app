import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { setPendingPhoto } from "@/lib/pendingPhoto";
import { colors, radius, spacing } from "@/lib/theme";

export default function CameraScreen() {
  const router = useRouter();
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
        setPendingPhoto(photo.uri);
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
        <Text style={styles.permissionText}>
          Precisamos da câmera pra fotografar a bula ou receita.
        </Text>
        <PrimaryButton label="Permitir câmera" onPress={requestPermission} />
        <PrimaryButton label="Cancelar" onPress={() => router.back()} variant="secondary" />
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
          <Text style={styles.frameHintText}>Centralize a bula ou caixa do remédio</Text>
        </View>
        <View style={styles.controlsRow}>
          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
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
