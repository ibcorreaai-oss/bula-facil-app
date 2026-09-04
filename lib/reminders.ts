import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { ExplainLanguage } from "./types";

const NOTIFICATION_COPY: Record<ExplainLanguage, { title: string; body: (name: string) => string }> = {
  pt: { title: "💊 Hora do remédio", body: (name) => `Não esqueça: ${name}` },
  en: { title: "💊 Medication time", body: (name) => `Don't forget: ${name}` },
  es: { title: "💊 Hora del medicamento", body: (name) => `No olvide: ${name}` },
  fr: { title: "💊 C'est l'heure du médicament", body: (name) => `N'oubliez pas : ${name}` },
  zh: { title: "💊 该吃药了", body: (name) => `别忘了：${name}` },
};

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleDailyReminder(
  medicationName: string,
  hour: number,
  minute: number,
  language: ExplainLanguage
): Promise<string> {
  const copy = NOTIFICATION_COPY[language];
  return Notifications.scheduleNotificationAsync({
    content: {
      title: copy.title,
      body: copy.body(medicationName),
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelReminder(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId).catch(() => {});
}
