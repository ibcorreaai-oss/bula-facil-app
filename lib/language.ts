import * as Localization from "expo-localization";
import { ExplainLanguage } from "./types";

const SUPPORTED_LANGUAGES: ExplainLanguage[] = ["pt", "en", "es", "fr", "zh"];

export function detectLanguage(): ExplainLanguage {
  const locales = Localization.getLocales();
  const primary = locales[0]?.languageCode;
  return SUPPORTED_LANGUAGES.includes(primary as ExplainLanguage) ? (primary as ExplainLanguage) : "en";
}
