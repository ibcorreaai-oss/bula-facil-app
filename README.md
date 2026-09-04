# 🩺 Explicare

**Point your camera at a medicine label, prescription, or lab result — get a calm, plain-language explanation in seconds, in your language.**

Built for the [RevenueCat Shipaton 2026](https://revenuecat-shipaton-2026.devpost.com/).

## The problem

Medicine labels and lab results are written in dense regulatory/medical language, tiny print, and are genuinely hard to parse for most people — especially the elderly, people with low health literacy, and anyone reading in a rush, in a language that isn't their first. Getting it wrong has real consequences: missed dosages, dangerous interactions, or unnecessary panic over a mild, well-known result.

Explicare turns a photo into a calm, accurate, plain-language explanation — without ever pretending to be a doctor.

## What it does

- **Two document types, one camera flow**: a toggle on the home screen switches between "medicine or prescription" and "lab result" — same camera, same consent, same Calm Mode underneath.
- **5 languages**: Portuguese, English, Spanish, French, and Chinese — both the app's own interface and the AI's explanation adapt to the device's language.
- **Refuses to guess**: if the photo is too blurry or unclear to safely read, the AI asks for a retake instead of inventing an answer. A wrong medication name or lab value is dangerous — never worth risking for a "best guess."
- **Comprehension checklist** (medicine): 2-4 high-stakes facts (e.g. "take with food, not on an empty stomach") the user actively taps to confirm they understood — not just passive text to skim past.
- **Status badges** (lab results): each parameter is tagged normal / attention / out of range / undetermined, alongside its reference range.
- **Calm Mode**: an optional, fully local "how are you feeling?" check-in, a breathing pacer, and an AI-written reassurance note calibrated to never falsely minimize a real warning, nor manufacture panic over a routine result.
- **Read aloud**: on-device text-to-speech for accessibility and low-literacy support.
- **Local-only history**: your scan history lives in SQLite on your device — never uploaded, never seen by us.
- **Family profiles & unlimited history (Premium via RevenueCat)**: the safety-critical core (scan, explain, checklist) is free forever; a subscription unlocks organizing scans across a family and keeping full history.
- **Medication interaction check (Premium)**: cross-checks medications already scanned for the same profile against well-documented interactions.

## Where it lives

- **Mobile app**: this repo (Expo / React Native)
- **Backend** (Groq vision API): [`bula-facil-api`](https://github.com/ibcorreaai-oss/bula-facil-api) — deployed at https://bula-facil-api.vercel.app (repo/domain names predate the Explicare rename; the app itself is Explicare)
- **Privacy policy**: https://bula-facil-api.vercel.app/privacy

## Tech stack

- **Expo SDK 57** (React Native, TypeScript, expo-router)
- **expo-camera**, **expo-image-picker**, **expo-image-manipulator** for capture
- **expo-localization** for language detection (pt/en/es/fr/zh)
- **expo-sqlite** for on-device history
- **expo-speech** for read-aloud
- **RevenueCat** (`react-native-purchases`) for the premium subscription
- Backend: **Next.js** + **Groq** (`qwen/qwen3.6-27b` vision model for both document types) — same camera-photo → vision LLM → structured JSON pattern, unified here from two earlier single-purpose apps ([Explica Meu Exame](https://explica-meu-exame.vercel.app) for lab results, [LabLingo](https://lablingo.vercel.app) for text-based lab reports), plus the original medicine-label flow, with a hard refusal to guess anything unreadable.

## Safety

Explicare never diagnoses, never suggests changing a dose, and always defers to a licensed doctor or pharmacist. Every response carries an explicit disclaimer, and the system prompt enforces a "when unsure, ask for a clearer photo" rule rather than guessing.

## Running it locally

```bash
npm install
npx expo start
```

RevenueCat purchases require a development build (`eas build --profile development`) — they don't work in Expo Go, since `react-native-purchases` is a native module. Everything else (camera, explanation, history, read-aloud) runs in Expo Go.

## License

MIT — see [LICENSE](./LICENSE).
