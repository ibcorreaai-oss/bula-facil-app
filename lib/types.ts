export type ExplainLanguage = "pt" | "en";

export type SideEffectSeverity = "common" | "serious";

export interface SideEffect {
  name: string;
  severity: SideEffectSeverity;
}

export interface MedicationExplanation {
  medicationName: string;
  summary: string;
  howToTake: string;
  sideEffects: SideEffect[];
  warnings: string[];
  /** 2-4 critical facts the user actively confirms they understood (tap-to-check UI). */
  keyPointsToConfirm: string[];
  questionsForDoctor: string[];
  /** Short, honest, non-alarmist note — same calibration principle as LabLingo's Calm Mode. */
  reassurance: string;
  /** True only when the label/photo genuinely warrants prompt follow-up with a doctor or pharmacist. */
  seekCareSoon: boolean;
  disclaimer: string;
  isDemo?: boolean;
}

export interface ExplainErrorResponse {
  error: string;
  /** True when the photo itself was the problem (blurry/illegible) — client should offer to retake, not just show a generic error. */
  retakePhoto?: boolean;
}

export interface ExplainRequestBody {
  imageBase64: string;
  mimeType: string;
  language: ExplainLanguage;
}

export interface ScanHistoryEntry {
  id: string;
  createdAt: number;
  medicationName: string;
  explanation: MedicationExplanation;
  photoUri?: string;
}
