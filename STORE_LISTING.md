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

Bula Fácil não é um dispositivo médico, não faz diagnóstico e não substitui a orientação de
um médico ou farmacêutico licenciado.
```

## Keywords (Apple, 100 chars total, comma-separated no spaces)
```
bula,remedio,medicamento,receita,farmacia,saude,idoso,acessibilidade,dosagem,interacao
```

## Google Play category
Medical (or Health & Fitness if Medical requires extra declarations not yet completed)

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
