import * as Localization from "expo-localization";
import { ExplainLanguage } from "./types";

export function detectLanguage(): ExplainLanguage {
  const locales = Localization.getLocales();
  const primary = locales[0]?.languageCode;
  return primary === "pt" ? "pt" : "en";
}
