# Devpost submission draft — Explicare (RevenueCat Shipaton 2026)

Copy fields below into the Devpost submission form once the store links exist.
STATUS: draft, waiting on App Store / Play Store / Galaxy Store links (blocked on Igor's
account approvals — see project_bula_facil_revenuecat_shipaton_03_09 memory for exact status).

## Project name
Explicare

## Tagline / elevator pitch
Point your camera at a medicine label, prescription, or lab result — get a calm,
plain-language explanation in seconds, in one of 5 languages, with a comprehension checklist
that makes sure you actually understood.

## Try it out links
- App Store: TODO
- Google Play: TODO
- Galaxy Store: TODO
- Source (mobile app): https://github.com/ibcorreaai-oss/bula-facil-app
- Source (backend / Groq vision API): https://github.com/ibcorreaai-oss/bula-facil-api
- Privacy policy: https://bula-facil-api.vercel.app/privacy

## Inspiration
Package inserts and lab reports are written in dense regulatory/clinical language and tiny
print — genuinely hard to parse for most people, and getting it wrong has real consequences
(missed dosages, dangerous interactions, or unnecessary panic over a well-known, mild result).
This isn't hypothetical: we'd already built two separate single-purpose web tools that hit the
same gap from opposite sides — one explaining medicine labels, one explaining lab results — and
realized during this build that the real product was never "explain medicine" or "explain lab
results," it was "explain the health document that's confusing you right now," whichever one
that is, in whatever language you actually read.

## What it does
Explicare turns a photo of a medicine box, insert, prescription, or lab result into a calm,
accurate, plain-language explanation — the same camera flow handles both, chosen with a single
toggle on the home screen:

**Medicine / prescription**
- What it's for, and how to take it correctly.
- Side effects, sorted by how common/serious they are.
- A **comprehension checklist** — 2 to 4 high-stakes facts the user actively taps to confirm
  they understood, instead of just skimming text and moving on.

**Lab result**
- A plain-language summary of the whole report.
- Each parameter tagged normal / attention / out of range / undetermined, with its reference
  range and a specific explanation of what it measures.
- Questions worth bringing to your doctor.

**Shared across both**
- An optional **Calm Mode**: a quick "how are you feeling about this?" check-in, a breathing
  pacer, and an AI-written reassurance note that's calibrated to never falsely minimize a real
  warning, and never manufacture panic over a routine result.
- Read-aloud, for accessibility and low-literacy support.
- On-device history — nothing about your medications or lab results is stored on our servers.
- **5 languages** (Portuguese, English, Spanish, French, Chinese) — both the interface and the
  AI's explanation follow the device's language.

If the photo is too blurry to safely read, the AI refuses to guess and asks for a retake
instead. A wrong medication name or lab value is dangerous — never worth risking for a "best
guess," even under time pressure to give an answer.

The safety-critical core (scan, explain, checklist) is free, permanently. A RevenueCat-powered
subscription unlocks organizing medications and results across a family/caregiver, daily
reminders, full history, and a medication interaction check.

## How we built it
Expo (React Native, SDK 57) + expo-router for the app; a small Next.js backend calls Groq's
`qwen/qwen3.6-27b` vision model with two system prompts engineered specifically for each
document type (never diagnose, never suggest a dosage change, always defer to a licensed
professional, refuse to guess anything unreadable). RevenueCat (`react-native-purchases`)
powers the premium subscription. This is a brand-new app — first released during the Shipaton
window — but it consolidates a camera→vision-LLM→structured-explanation pattern our team had
already validated in two earlier, separately-shipped web projects (a medicine-label explainer
and a lab-result explainer), which meant the build window went into what was actually new: the
mobile-native camera flow, the comprehension checklist, Calm Mode, and unifying both flows
behind one 5-language interface.

## Challenges we ran into
- Calibrating the AI to be honest under uncertainty: both system prompts needed explicit rules
  for when to flag something as worth following up on soon vs. when to just reassure — getting
  either direction wrong (false alarm or false calm) defeats the point of the app.
- Our Groq account's free-tier output-token-per-minute limit tightened between when we last
  tested the medicine flow and when we tested the new lab flow — the "already working" endpoint
  had silently started failing in the meantime. Fixed by trimming the reasoning budget
  (`reasoning_effort: "none"`) instead of the actual answer, so quality didn't drop.
- Expo SDK 57 shipped API changes since our last mobile build (image manipulation, file
  system) — had to verify the actual installed type definitions rather than trust documentation
  that described a slightly different version.

## Accomplishments we're proud of
A safety-first design where the free tier is the safety-critical path, not a limited demo of
it — the checklist, the "don't guess" refusal, and the calm/reassurance flow are all in the
free experience, on purpose, for both document types.

## What we learned
That the hardest part of "explain this scary document in plain language" is emotional
calibration, not language simplification — the same lesson held across two genuinely different
domains (medication labels and lab results), which is what convinced us to merge them into one
product instead of keeping two narrow ones.

## What's next
- Additional languages (Arabic, Hindi) — the app's translation architecture was built to make
  this a content addition, not a rework.
- Barcode/DataMatrix scanning for faster capture on printed packaging.
- Multi-page capture for lab reports that span more than one page.

## Built With
expo, react-native, typescript, expo-router, expo-camera, expo-sqlite, expo-speech,
expo-localization, groq, nextjs, vercel, revenuecat, react-native-purchases

## Team
Igor Brito Correa (Cortex Tech)
