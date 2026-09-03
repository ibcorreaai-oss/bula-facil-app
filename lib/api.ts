import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { API_BASE_URL } from "./config";
import { ExplainLanguage, MedicationExplanation } from "./types";

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

export async function explainPhoto(
  photoUri: string,
  language: ExplainLanguage
): Promise<MedicationExplanation> {
  const { base64, mimeType } = await prepareImageBase64(photoUri);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64, mimeType, language }),
    });
  } catch {
    throw new ExplainApiError(
      language === "en"
        ? "Couldn't reach the server. Check your connection and try again."
        : "Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo."
    );
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    throw new ExplainApiError(
      data?.error ??
        (language === "en" ? "Something went wrong. Please try again." : "Algo deu errado. Tente novamente."),
      Boolean(data?.retakePhoto)
    );
  }
  return data as MedicationExplanation;
}
