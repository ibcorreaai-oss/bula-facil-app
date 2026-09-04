# Store listing copy — Explicare

Ready to paste into App Store Connect / Google Play Console / Samsung Seller Portal once each
account exists. Character limits noted where the store enforces one.

## App name
**Explicare**

## Subtitle / short description
- Apple subtitle (30 chars max): `Bula e exame em segundos`
- Google Play short description (80 chars max): `Fotografe uma bula ou exame e entenda em segundos, em linguagem simples.`
- Samsung Galaxy Store short description: `Fotografe qualquer bula, receita ou exame e entenda em linguagem simples, na hora.`

## Full description (pt-BR, works for all 3 stores)

```
Explicare transforma uma foto de bula, caixa de remédio, receita médica ou exame de
laboratório numa explicação calma e em linguagem simples — sem trocar a orientação do seu
médico ou farmacêutico. Disponível em português, inglês, espanhol, francês e chinês.

COMO FUNCIONA
1. Escolha o tipo: remédio/receita ou exame de laboratório
2. Aponte a câmera pro documento
3. A IA explica em linguagem simples o que aquilo significa
4. Confirme que entendeu os pontos mais importantes antes de seguir

RECURSOS GRÁTIS (pra sempre)
• Escaneamento e explicação ilimitados, remédio ou exame
• Checklist de confirmação de entendimento (remédio) e status por parâmetro (exame)
• Leitura em voz alta
• Modo Calma: um momento de respiração guiada quando o resultado deixa você ansioso(a)
• Nunca inventa um nome de remédio nem um valor de exame — se a foto não estiver legível, pede
  pra tirar de novo

PREMIUM
• Histórico completo de tudo já explicado
• Perfis separados pra cada pessoa da família
• Lembretes diários de horário de remédio
• Checagem de interação entre remédios que a pessoa já tomou

PRIVACIDADE EM PRIMEIRO LUGAR
Sua foto é analisada só pra gerar a explicação e nunca fica guardada em nosso servidor. Seu
histórico fica só no seu aparelho.

Explicare não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma
condição médica. As explicações são geradas por inteligência artificial e não substituem a
orientação de um médico ou farmacêutico licenciado.
```

## Full description (English)

```
Explicare turns a photo of a medicine label, package, prescription, or lab result into a calm,
plain-language explanation — without replacing your doctor's or pharmacist's guidance.
Available in Portuguese, English, Spanish, French, and Chinese.

HOW IT WORKS
1. Choose the type: medicine/prescription or lab result
2. Point the camera at the document
3. AI explains in plain language what it means
4. Confirm you understood the most important points before moving on

FREE FEATURES (forever)
• Unlimited scans and explanations, medicine or lab result
• Comprehension confirmation checklist (medicine) and per-parameter status (lab result)
• Read-aloud
• Calm Mode: a guided breathing moment when the result makes you anxious
• Never invents a medication name or a lab value — if the photo isn't legible, it asks for a
  retake

PREMIUM
• Full history of everything already explained
• Separate profiles for each family member
• Daily medicine-time reminders
• Interaction check between medications the person has taken

PRIVACY FIRST
Your photo is only analyzed to generate the explanation and is never stored on our server.
Your history stays only on your device.

Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical
condition. Explanations are AI-generated and do not replace guidance from a licensed doctor or
pharmacist.
```

## Keywords (Apple, 100 chars total, comma-separated no spaces)
```
bula,exame,remedio,medicamento,receita,laboratorio,farmacia,saude,idoso,acessibilidade
```

## Category — use Health & Fitness / Reference, NOT "Medical"
Researched 03/09/2026: Apple's "Medical" category and Google's "Medical Device" labeling trigger
much heavier review (regulatory approval documentation, proof of clinical validation) meant for
apps that measure/diagnose. Explicare only explains text/labels/results — it doesn't measure or
diagnose anything — so it belongs in **Health & Fitness** (Apple/Samsung) or **Health &
Fitness → Medical Reference** if Google's picker forces a subcategory. Do not select "Medical"
even though it's tempting given the subject matter; it invites review criteria (device
certification, clinical evidence) that don't apply and will slow or block approval.

## Google Play: "Health apps declaration" form (mandatory since ~April 2026)
Google Play Console requires this form for any app with health-adjacent functionality. Fill it
out honestly: Explicare provides general health *education* (explaining text/values that already
exist on a label or report), not diagnosis, treatment, monitoring, or health data storage tied to
an identity. When filling the form, also paste the exact required disclaimer into both the store
description AND make sure it's visible in-app (already added: Settings screen + every
explanation screen show "não é um dispositivo médico e não diagnostica, trata, cura ou previne
nenhuma condição médica" / the equivalent in each of the app's 5 languages).

## Apple: explicit AI data-sharing consent (Guideline 5.1.2(i))
Sharing a user's photo with a third-party AI service (Groq) requires clear disclosure and an
explicit permission step, not just a privacy-policy mention. Already implemented: a one-time
consent modal appears before the first camera/gallery use (`components/ConsentModal.tsx`),
naming Groq and stating the photo isn't stored — covers both document types (medicine and lab
result) since the same consent applies to either. Confirm during Apple review notes that this
consent flow exists, in case a reviewer asks.

## Content rating notes
No user-generated content, no ads, no violence — should qualify for the lowest content rating
tier on all 3 stores. Answer "does the app provide medical information" honestly — Explicare
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

(URLs still carry the pre-rename `bula-facil-api` domain — the project was renamed to Explicare
in the app itself before any store listing existed; renaming the Vercel project's domain too is
optional cleanup, not a blocker, see the review notes for this session.)
