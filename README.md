# 💊 Bula Fácil

**Point your camera at any medicine label, package insert, or prescription — get a calm, plain-language explanation in seconds.**

Built for the [RevenueCat Shipaton 2026](https://revenuecat-shipaton-2026.devpost.com/).

## The problem

Package inserts ("bulas") are written in dense regulatory/medical language, tiny print, and are genuinely hard to parse for most people — especially the elderly, people with low health literacy, and anyone reading a label in a rush. Getting it wrong has real consequences: missed dosages, dangerous interactions, or unnecessary panic over a mild, well-known side effect.

Bula Fácil turns a photo into a calm, accurate, plain-language explanation — without ever pretending to be a doctor.

## What it does

- **Camera-first**: point at a medicine box, insert, or prescription — no typing.
- **Refuses to guess**: if the photo is too blurry or unclear to safely identify the medication, the AI asks for a retake instead of inventing an answer. A wrong medication name is dangerous — never worth risking for a "best guess."
- **Comprehension checklist**: 2-4 high-stakes facts (e.g. "take with food, not on an empty stomach") the user actively taps to confirm they understood — not just passive text to skim past.
- **Calm Mode**: an optional, fully local "how are you feeling?" check-in, a breathing pacer, and an AI-written reassurance note calibrated to never falsely minimize a real warning, nor manufacture panic over a routine medication.
- **Read aloud**: on-device text-to-speech for accessibility and low-literacy support.
- **Local-only history**: your scan history lives in SQLite on your device — never uploaded, never seen by us.
- **Family profiles & unlimited history (Premium via RevenueCat)**: the safety-critical core (scan, explain, checklist) is free forever; a subscription unlocks organizing medications across a family and keeping full history.

## Where it lives

- **Mobile app**: this repo (Expo / React Native)
- **Backend** (Groq vision API): [`bula-facil-api`](https://github.com/ibcorreaai-oss/bula-facil-api) — deployed at https://bula-facil-api.vercel.app
- **Privacy policy**: https://bula-facil-api.vercel.app/privacy

## Tech stack

- **Expo SDK 57** (React Native, TypeScript, expo-router)
- **expo-camera**, **expo-image-picker**, **expo-image-manipulator** for capture
- **expo-sqlite** for on-device history
- **expo-speech** for read-aloud
- **RevenueCat** (`react-native-purchases`) for the premium subscription
- Backend: **Next.js** + **Groq** (`qwen/qwen3.6-27b` vision model) — same camera-photo → vision LLM → structured JSON pattern already validated in two earlier projects ([Explica Meu Exame](https://explica-meu-exame.vercel.app), [LabLingo](https://lablingo.vercel.app)), adapted here for medicine labels with a hard refusal to guess an unreadable name.

## Safety

Bula Fácil never diagnoses, never suggests changing a dose, and always defers to a licensed doctor or pharmacist. Every response carries an explicit disclaimer, and the system prompt enforces a "when unsure, ask for a clearer photo" rule rather than guessing.

## Running it locally

```bash
npm install
npx expo start
```

RevenueCat purchases require a development build (`eas build --profile development`) — they don't work in Expo Go, since `react-native-purchases` is a native module. Everything else (camera, explanation, history, read-aloud) runs in Expo Go.

## License

MIT — see [LICENSE](./LICENSE).
