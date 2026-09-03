import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { clearReminder, setReminder } from "@/lib/db";
import { cancelReminder, ensureNotificationPermission, scheduleDailyReminder } from "@/lib/reminders";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";

const PRESETS = [
  { label: "Manhã", hour: 8, minute: 0 },
  { label: "Tarde", hour: 14, minute: 0 },
  { label: "Noite", hour: 20, minute: 0 },
];

export function ReminderControl({
  scanId,
  medicationName,
  reminderNotificationId,
  reminderHour,
  onChanged,
}: {
  scanId: string;
  medicationName: string;
  reminderNotificationId: string | null;
  reminderHour: number | null;
  onChanged: () => void;
}) {
  const db = useSQLiteContext();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handlePreset(hour: number, minute: number) {
    const premium = await isPremium();
    if (!premium) {
      router.push("/paywall");
      return;
    }
    setBusy(true);
    try {
      const granted = await ensureNotificationPermission();
      if (!granted) return;
      if (reminderNotificationId) await cancelReminder(reminderNotificationId);
      const id = await scheduleDailyReminder(medicationName, hour, minute);
      await setReminder(db, scanId, id, hour, minute);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    setBusy(true);
    try {
      if (reminderNotificationId) await cancelReminder(reminderNotificationId);
      await clearReminder(db, scanId);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  if (reminderHour !== null) {
    return (
      <View style={styles.card}>
        <Text style={styles.activeText}>
          🔔 Lembrete diário ativo às {String(reminderHour).padStart(2, "0")}h
        </Text>
        <Pressable onPress={handleCancel} disabled={busy}>
          <Text style={styles.cancelLink}>Desativar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🔔 Lembrete diário (Premium)</Text>
      <View style={styles.row}>
        {PRESETS.map((p) => (
          <Pressable key={p.label} onPress={() => handlePreset(p.hour, p.minute)} disabled={busy} style={styles.preset}>
            <Text style={styles.presetText}>
              {p.label}{"\n"}
              {String(p.hour).padStart(2, "0")}h
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { fontSize: 14, fontWeight: "800", color: colors.text },
  row: { flexDirection: "row", gap: spacing.sm },
  preset: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  presetText: { fontSize: 12, fontWeight: "700", color: colors.primaryDark, textAlign: "center" },
  activeText: { fontSize: 14, fontWeight: "700", color: colors.primaryDark },
  cancelLink: { fontSize: 13, color: colors.danger, fontWeight: "700" },
});
