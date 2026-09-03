// Passing a large photo through expo-router URL params is impractical (string-only, size limits).
// The camera/gallery pickers stash the captured URI here right before navigating to /result,
// which reads it once on mount. This is intentionally the only piece of cross-screen state in the app.
let pendingUri: string | null = null;

export function setPendingPhoto(uri: string) {
  pendingUri = uri;
}

export function takePendingPhoto(): string | null {
  const uri = pendingUri;
  pendingUri = null;
  return uri;
}
