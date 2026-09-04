import { DocumentType } from "./types";

// Passing a large photo through expo-router URL params is impractical (string-only, size limits).
// The camera/gallery pickers stash the captured URI here right before navigating to /result,
// which reads it once on mount. This is intentionally the only piece of cross-screen state in the app.
let pendingUri: string | null = null;
let pendingDocumentType: DocumentType = "medication";

export function setPendingPhoto(uri: string, documentType: DocumentType = "medication") {
  pendingUri = uri;
  pendingDocumentType = documentType;
}

export function takePendingPhoto(): { uri: string; documentType: DocumentType } | null {
  const uri = pendingUri;
  const documentType = pendingDocumentType;
  pendingUri = null;
  return uri ? { uri, documentType } : null;
}
