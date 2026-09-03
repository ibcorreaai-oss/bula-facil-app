import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme";

const CYCLE_MS = 8000;

export function BreathingPacer({ inLabel, outLabel }: { inLabel: string; outLabel: string }) {
  const scale = useRef(new Animated.Value(0.72)).current;
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled || reduced) return;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: CYCLE_MS / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.72,
            duration: CYCLE_MS / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    });
    const id = setInterval(() => setPhase((p) => (p === "in" ? "out" : "in")), CYCLE_MS / 2);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.outerCircle, { transform: [{ scale }] }]}>
        <View style={styles.innerCircle} />
      </Animated.View>
      <Text style={styles.label}>{phase === "in" ? inLabel : outLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.sm },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#99F6E4",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.primaryDark,
  },
});
