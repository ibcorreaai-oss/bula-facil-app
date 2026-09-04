import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { clearReminder, setReminder } from "@/lib/db";
import { detectLanguage } from "@/lib/language";
import { cancelReminder, ensureNotificationPermission, scheduleDailyReminder } from "@/lib/reminders";
import { isPremium } from "@/lib/purchases";
import { colors, radius, spacing } from "@/lib/theme";
import { ExplainLanguage } from "@/lib/types";

const PRESET_TIMES = [
  { hour: 8, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 20, minute: 0 },
];

const L: Record<
  ExplainLanguage,
  { presetLabels: string[]; title: string; active: (hour: string) => string; disable: string }
> = {
  pt: {
    presetLabels: ["Manhã", "Tarde", "Noite"],
    title: "🔔 Lembrete diário (Premium)",
    active: (hour) => `🔔 Lembrete diário ativo às ${hour}h`,
    disable: "Desativar",
  },
  en: {
    presetLabels: ["Morning", "Afternoon", "Evening"],
    title: "🔔 Daily reminder (Premium)",
    active: (hour) => `🔔 Daily reminder active at ${hour}:00`,
    disable: "Turn off",
  },
  es: {
    presetLabels: ["Mañana", "Tarde", "Noche"],
    title: "🔔 Recordatorio diario (Premium)",
    active: (hour) => `🔔 Recordatorio diario activo a las ${hour}h`,
    disable: "Desactivar",
  },
  fr: {
    presetLabels: ["Matin", "Après-midi", "Soir"],
    title: "🔔 Rappel quotidien (Premium)",
    active: (hour) => `🔔 Rappel quotidien actif à ${hour}h`,
    disable: "Désactiver",
  },
  zh: {
    presetLabels: ["早上", "下午", "晚上"],
    title: "🔔 每日提醒（高级版）",
    active: (hour) => `🔔 每日提醒已设为 ${hour}:00`,
    disable: "关闭",
  },
};

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
  const t = L[detectLanguage()];
  const PRESETS = PRESET_TIMES.map((p, i) => ({ ...p, label: t.presetLabels[i] }));
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
      const id = await scheduleDailyReminder(medicationName, hour, minute, detectLanguage());
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
        <Text style={styles.activeText}>{t.active(String(reminderHour).padStart(2, "0"))}</Text>
        <Pressable onPress={handleCancel} disabled={busy}>
          <Text style={styles.cancelLink}>{t.disable}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t.title}</Text>
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
