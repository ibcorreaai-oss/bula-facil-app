import { API_BASE_URL } from "./config";
import { ExplainLanguage } from "./types";

export interface InteractionPair {
  medications: string[];
  note: string;
  severity: "minor" | "moderate" | "serious";
}

export interface InteractionCheckResult {
  hasKnownInteractions: boolean;
  summary: string;
  pairs: InteractionPair[];
  disclaimer: string;
  isDemo?: boolean;
}

export async function checkInteractions(
  medicationNames: string[],
  language: ExplainLanguage
): Promise<InteractionCheckResult> {
  const res = await fetch(`${API_BASE_URL}/api/check-interactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicationNames, language }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Something went wrong.");
  }
  return data as InteractionCheckResult;
}
