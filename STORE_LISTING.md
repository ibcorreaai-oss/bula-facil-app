# Store listing copy — Bula Fácil

Ready to paste into App Store Connect / Google Play Console / Samsung Seller Portal once each
account exists. Character limits noted where the store enforces one.

## App name
**Bula Fácil**

## Subtitle / short description
- Apple subtitle (30 chars max): `Entenda sua bula na hora`
- Google Play short description (80 chars max): `Fotografe a bula do remédio e entenda em segundos, em linguagem simples.`
- Samsung Galaxy Store short description: `Fotografe qualquer bula ou receita e entenda em linguagem simples, na hora.`

## Full description (pt-BR, works for all 3 stores)

```
Bula Fácil transforma uma foto de bula, caixa de remédio ou receita médica numa explicação
calma e em linguagem simples — sem trocar a orientação do seu médico ou farmacêutico.

COMO FUNCIONA
1. Aponte a câmera pra bula, caixa ou receita
2. A IA explica pra que serve, como tomar e o que observar
3. Confirme que entendeu os pontos mais importantes antes de seguir

RECURSOS GRÁTIS (pra sempre)
• Escaneamento e explicação ilimitados
• Checklist de confirmação de entendimento
• Leitura em voz alta
• Modo Calma: um momento de respiração guiada quando o resultado deixa você ansioso(a)
• Nunca inventa um nome de remédio — se a foto não estiver legível, pede pra tirar de novo

PREMIUM
• Histórico completo de remédios já explicados
• Perfis separados pra cada pessoa da família
• Lembretes diários de horário
• Checagem de interação entre remédios que a pessoa já tomou

PRIVACIDADE EM PRIMEIRO LUGAR
Sua foto é analisada só pra gerar a explicação e nunca fica guardada em nosso servidor. Seu
histórico fica só no seu aparelho.

Bula Fácil não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma
condição médica. As explicações são geradas por inteligência artificial e não substituem a
orientação de um médico ou farmacêutico licenciado.
```

## Full description (English)

```
Bula Fácil turns a photo of a medicine label, package, or prescription into a calm,
plain-language explanation — without replacing your doctor's or pharmacist's guidance.

HOW IT WORKS
1. Point the camera at the label, package, or prescription
2. AI explains what it's for, how to take it, and what to watch for
3. Confirm you understood the most important points before moving on

FREE FEATURES (forever)
• Unlimited scans and explanations
• Comprehension confirmation checklist
• Read-aloud
• Calm Mode: a guided breathing moment when the result makes you anxious
• Never invents a medication name — if the photo isn't legible, it asks for a retake

PREMIUM
• Full history of explained medications
• Separate profiles for each family member
• Daily time reminders
• Interaction check between medications the person has taken

PRIVACY FIRST
Your photo is only analyzed to generate the explanation and is never stored on our server.
Your history stays only on your device.

Bula Fácil is not a medical device and does not diagnose, treat, cure, or prevent any medical
condition. Explanations are AI-generated and do not replace guidance from a licensed doctor or
pharmacist.
```

## Keywords (Apple, 100 chars total, comma-separated no spaces)
```
bula,remedio,medicamento,receita,farmacia,saude,idoso,acessibilidade,dosagem,interacao
```

## Category — use Health & Fitness / Reference, NOT "Medical"
Researched 03/09/2026: Apple's "Medical" category and Google's "Medical Device" labeling trigger
much heavier review (regulatory approval documentation, proof of clinical validation) meant for
apps that measure/diagnose. Bula Fácil only explains text/labels — it doesn't measure or
diagnose anything — so it belongs in **Health & Fitness** (Apple/Samsung) or **Health &
Fitness → Medical Reference** if Google's picker forces a subcategory. Do not select "Medical"
even though it's tempting given the subject matter; it invites review criteria (device
certification, clinical evidence) that don't apply and will slow or block approval.

## Google Play: "Health apps declaration" form (mandatory since ~April 2026)
Google Play Console requires this form for any app with health-adjacent functionality. Fill it
out honestly: Bula Fácil provides general health *education* (explaining text that already
exists on a label), not diagnosis, treatment, monitoring, or health data storage tied to an
identity. When filling the form, also paste the exact required disclaimer into both the store
description AND make sure it's visible in-app (already added: Settings screen + every
explanation screen show "não é um dispositivo médico e não diagnostica, trata, cura ou previne
nenhuma condição médica" / the English equivalent).

## Apple: explicit AI data-sharing consent (Guideline 5.1.2(i))
Sharing a user's photo with a third-party AI service (Groq) requires clear disclosure and an
explicit permission step, not just a privacy-policy mention. Already implemented: a one-time
consent modal appears before the first camera/gallery use (`components/ConsentModal.tsx`),
naming Groq and stating the photo isn't stored. Confirm during Apple review notes that this
consent flow exists, in case a reviewer asks.

## Content rating notes
No user-generated content, no ads, no violence — should qualify for the lowest content rating
tier on all 3 stores. Answer "does the app provide medical information" honestly — Bula Fácil
is educational/informational, not a diagnostic or prescribing tool.

## Data safety / App Privacy declarations (Apple "App Privacy" + Google "Data safety" forms)
- Data collected: none tied to identity. Photos are processed transiently by a third-party AI
  API (Groq) and are not stored after the response is generated.
- Data shared with third parties: Groq (photo, for the sole purpose of generating the
  explanation), RevenueCat (anonymous purchase/subscription status only).
- No advertising, no analytics/tracking SDKs, no data sold.
- Local-only storage: scan history (SQLite, on-device).

## Support & marketing URLs
- Support/contact: cortextechbr@gmail.com
- Privacy policy: https://bula-facil-api.vercel.app/privacy
- Marketing/landing page: https://bula-facil-api.vercel.app
