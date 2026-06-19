# 7.2 Monitoramento e observabilidade

## Em dev

O `lib/errors.ts` captura erro, rejeição e `console.error`; o ErrorHud mostra na
tela, sem abrir o devtools. O smoke do CI é o guardião contínuo: qualquer erro
de console derruba a build.

## Planejado em produção

- Captura silenciosa do `errors.ts` pronta pra plugar um endpoint (Sentry leve ou função própria).
- Analytics leve e respeitoso (por exemplo Plausible), carregado sem bloquear o boot.
- Web Vitals (LCP, CLS, INP) e Lighthouse CI pra vigiar a meta de performance.

## Alertas

Enquanto não há backend, o sinal é o CI: build ou smoke vermelho barra o merge.
Com deploy, o preview por PR é a primeira linha de inspeção.

Relacionado: [01-deploy](01-deploy.md), [03-backup-recuperacao](03-backup-recuperacao.md).
