import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { API_BASE_URL } from "./config";
import { ExplainLanguage, LabExplanation, MedicationExplanation } from "./types";

export class ExplainApiError extends Error {
  retakePhoto: boolean;
  constructor(message: string, retakePhoto = false) {
    super(message);
    this.retakePhoto = retakePhoto;
  }
}

/** Resizes/compresses the photo before upload so it stays well under the API's size limit and uploads fast on mobile data. */
async function prepareImageBase64(photoUri: string): Promise<{ base64: string; mimeType: string }> {
  const result = await manipulateAsync(photoUri, [{ resize: { width: 1280 } }], {
    compress: 0.7,
    format: SaveFormat.JPEG,
    base64: true,
  });
  if (!result.base64) {
    // manipulateAsync always returns base64 when { base64: true } is passed — this should be unreachable.
    throw new Error("Image processing did not return base64 data.");
  }
  return { base64: result.base64, mimeType: "image/jpeg" };
}

async function postPhoto<T>(endpoint: string, photoUri: string, language: ExplainLanguage): Promise<T> {
  const { base64, mimeType } = await prepareImageBase64(photoUri);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64, mimeType, language }),
    });
  } catch {
    throw new ExplainApiError(NETWORK_ERROR_MESSAGE[language]);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    throw new ExplainApiError(data?.error ?? GENERIC_ERROR_MESSAGE[language], Boolean(data?.retakePhoto));
  }
  return data as T;
}

export async function explainPhoto(photoUri: string, language: ExplainLanguage): Promise<MedicationExplanation> {
  return postPhoto<MedicationExplanation>("/api/explain", photoUri, language);
}

export async function explainLabPhoto(photoUri: string, language: ExplainLanguage): Promise<LabExplanation> {
  return postPhoto<LabExplanation>("/api/explain-lab", photoUri, language);
}

const NETWORK_ERROR_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.",
  en: "Couldn't reach the server. Check your connection and try again.",
  es: "No pudimos conectar con el servidor. Verifique su conexión e inténtelo de nuevo.",
  fr: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
  zh: "无法连接到服务器。请检查网络连接后重试。",
};

const GENERIC_ERROR_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Algo deu errado. Tente novamente.",
  en: "Something went wrong. Please try again.",
  es: "Algo salió mal. Inténtelo de nuevo.",
  fr: "Une erreur s'est produite. Veuillez réessayer.",
  zh: "出了点问题。请再试一次。",
};
