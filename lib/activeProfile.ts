import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExplainLanguage } from "./types";

const KEY = "bulafacil.activeProfile";
export const DEFAULT_PROFILE = "Eu";

const ME_LABEL: Record<ExplainLanguage, string> = {
  pt: "Eu",
  en: "Me",
  es: "Yo",
  fr: "Moi",
  zh: "我",
};

/** DEFAULT_PROFILE is the stored sentinel value in the database — this maps it to a localized label for display only. */
export function displayProfileName(name: string, language: ExplainLanguage): string {
  return name === DEFAULT_PROFILE ? ME_LABEL[language] : name;
}

export async function getActiveProfile(): Promise<string> {
  const stored = await AsyncStorage.getItem(KEY);
  return stored ?? DEFAULT_PROFILE;
}

export async function setActiveProfile(name: string): Promise<void> {
  await AsyncStorage.setItem(KEY, name);
}
