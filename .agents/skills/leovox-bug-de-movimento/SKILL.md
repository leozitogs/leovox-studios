---
name: leovox-bug-de-movimento
description: Investiga e corrige bug de animação, scroll, pin, reverse ou transição no portfólio Leovox reproduzindo no browser antes de corrigir e provando a correção do mesmo jeito. Use quando algo "pula", "trava", "some no reverse", "fica aceso", "desalinha no refresh" ou quebra num ritmo de scroll.
---

# Bug de movimento

Lei da casa: bug de animação se reproduz no browser antes de corrigir, e a correção se prova do
mesmo jeito. Palpite lendo código não conta como diagnóstico.

## 1. Reproduzir

1. `npm run build` e suba o preview, ou use o dev server em `http://localhost:5173`.
2. Abra com `?harness=1` e use `window.__LEOVOX_HARNESS__`:
   `setProgress(id, p)`, `enterScene(id)`, `settle()`, `getSceneState(id)`,
   `getActiveAnimations()`, `getScrollTriggers()`, `collectFrameMetrics(ms)`.
3. Escreva o roteiro mínimo que mostra o defeito: progresso de partida, gesto (wheel, teclado,
   salto, reverse, resize, refresh) e o estado errado observado.
4. Transforme o roteiro num teste Playwright em `harness/browser/` que **falha agora**. Se a falha
   não reproduz no teste, o diagnóstico ainda não acabou.

## 2. Diagnosticar contra as leis

Confira as leis de animação do `AGENTS.md` e do `docs/harness/MOTION.md`. As causas mais comuns:

- opacidade tweenada dentro de timeline scrubada (tem de ser função pura do progresso);
- `.to` preguiçoso em timeline scrubada (tem de ser `fromTo` com valores explícitos);
- entrada que deixa estilo inline e contamina o estado inicial do scrub;
- seletor em string apontando para fora da seção escopada;
- estado que só nasce por gesto e não por progresso (refresh e salto chegam errados);
- listener, timeline ou estilo que sobrevive ao teardown.

## 3. Corrigir e provar

1. Corrija a causa, não o sintoma. Nada de `setTimeout` para esperar o estado certo.
2. O teste do passo 1 passa; os vizinhos continuam passando (`npm run test:browser:chromium`).
3. Prove nos ritmos: lento, rápido, alternando direção, salto pelo menu, reload no meio e reduced
   motion.
4. Se o bug cabia num critério do contrato, cite o ID no título do teste.

## Saída

O roteiro de reprodução, a causa em uma frase, o diff e o teste que falhava e agora passa.
