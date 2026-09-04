import { DocumentType } from "./types";

// Passing a large photo through expo-router URL params is impractical (string-only, size limits).
// The camera/gallery pickers stash the captured URI here right before navigating to /result,
// which reads it once on mount. This is intentionally the only piece of cross-screen state in the app.
let pendingUri: string | null = null;
let pendingDocumentType: DocumentType = "medication";

export function setPendingPhoto(uri: string, documentType: DocumentType = "medication") {
  pendingUri = uri;
  pendingDocumentType = documentType;
  lastSelectedDocumentType = documentType;
}

export function takePendingPhoto(): { uri: string; documentType: DocumentType } | null {
  const uri = pendingUri;
  const documentType = pendingDocumentType;
  pendingUri = null;
  return uri ? { uri, documentType } : null;
}

// Remembers the Home screen's last document-type toggle choice for the rest of this app
// session (not persisted across restarts) -- otherwise it silently resets to "medication"
// every time Home remounts (e.g. after visiting History or Settings and coming back).
let lastSelectedDocumentType: DocumentType = "medication";

export function getLastSelectedDocumentType(): DocumentType {
  return lastSelectedDocumentType;
}

export function setLastSelectedDocumentType(documentType: DocumentType) {
  lastSelectedDocumentType = documentType;
}
