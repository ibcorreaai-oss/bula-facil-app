# Devpost submission draft — Bula Fácil (RevenueCat Shipaton 2026)

Copy fields below into the Devpost submission form once the store links exist.
STATUS: draft, waiting on App Store / Play Store / Galaxy Store links (blocked on Igor's
account approvals — see project_bula_facil_revenuecat_shipaton_03_09 memory for exact status).

## Project name
Bula Fácil

## Tagline / elevator pitch
Point your camera at any medicine label or prescription — get a calm, plain-language
explanation in seconds, with a comprehension checklist that makes sure you actually understood.

## Try it out links
- App Store: TODO
- Google Play: TODO
- Galaxy Store: TODO
- Source (mobile app): https://github.com/ibcorreaai-oss/bula-facil-app
- Source (backend / Groq vision API): https://github.com/ibcorreaai-oss/bula-facil-api
- Privacy policy: https://bula-facil-api.vercel.app/privacy

## Inspiration
Package inserts are written in dense regulatory language and tiny print — genuinely hard to
parse for most people, and getting it wrong has real consequences (missed dosages, dangerous
interactions, or unnecessary panic over a well-known, mild side effect). This isn't
hypothetical: our team has built several health-literacy tools before (a lab-result explainer,
an occupational-health compliance app), and the same gap kept showing up — the moment between
"I have this medicine" and "I actually understand what to do with it" is where people get hurt
or scared for no reason.

## What it does
Bula Fácil turns a photo of a medicine box, insert, or handwritten prescription into a calm,
accurate, plain-language explanation:
- What the medication is for, and how to take it correctly.
- Side effects, sorted by how common/serious they are.
- A **comprehension checklist** — 2 to 4 high-stakes facts the user actively taps to confirm
  they understood, instead of just skimming text and moving on.
- An optional **Calm Mode**: a quick "how are you feeling about this?" check-in, a breathing
  pacer, and an AI-written reassurance note that's calibrated to never falsely minimize a real
  warning, and never manufacture panic over a routine medication.
- Read-aloud, for accessibility and low-literacy support.
- On-device history — nothing about your medications is stored on our servers.

If the photo is too blurry to safely identify the medication, the AI refuses to guess and asks
for a retake instead. A wrong medication name is dangerous — never worth risking for a "best
guess," even under time pressure to give an answer.

The safety-critical core (scan, explain, checklist) is free, permanently. A RevenueCat-powered
subscription unlocks organizing medications across a family/caregiver, and full history.

## How we built it
Expo (React Native, SDK 57) + expo-router for the app; a small Next.js backend calls Groq's
`qwen/qwen3.6-27b` vision model with a system prompt engineered specifically for medication
safety (never diagnose, never suggest a dosage change, always defer to a licensed professional,
refuse to guess an unreadable name). RevenueCat (`react-native-purchases`) powers the premium
subscription. This is a brand-new app — first released during the Shipaton window — but it
builds on a camera→vision-LLM→structured-explanation pattern our team had already validated in
two earlier, separately-shipped web projects, which meant we could spend the build window on
what was actually new: the mobile-native camera flow, the comprehension checklist, and Calm Mode.

## Challenges we ran into
- Calibrating the AI to be honest under uncertainty: the system prompt needed explicit rules
  for when to flag a medication as worth following up on soon vs. when to just reassure —
  getting either direction wrong (false alarm or false calm) defeats the point of the app.
- Expo SDK 57 shipped API changes since our last mobile build (image manipulation, file
  system) — had to verify the actual installed type definitions rather than trust documentation
  that described a slightly different version.

## Accomplishments we're proud of
A safety-first design where the free tier is the safety-critical path, not a limited demo of
it — the checklist, the "don't guess" refusal, and the calm/reassurance flow are all in the
free experience, on purpose.

## What we learned
That the hardest part of "explain this scary document in plain language" is emotional
calibration, not language simplification — the same lesson we'd already learned building a
lab-result explainer, now confirmed in a second, unrelated domain (medication labels).

## What's next
- Multi-language output beyond Portuguese/English.
- Interaction checking across a user's own medication history (premium).
- Barcode/DataMatrix scanning for faster capture on printed packaging.

## Built With
expo, react-native, typescript, expo-router, expo-camera, expo-sqlite, expo-speech, groq,
nextjs, vercel, revenuecat, react-native-purchases

## Team
Igor Brito Correa (Cortex Tech)
