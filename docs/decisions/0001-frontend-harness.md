# ADR 0001: harness frontend orientado por contratos

- Status: aceito
- Data: 2026-09-16

## Contexto

O projeto já tinha validação estática e smoke de Chromium, mas as cenas complexas dependiam de esperas fixas e inspeção manual difícil de reproduzir.

## Decisão

Manter contratos de cena versionados, expor uma API determinística somente sob `?harness=1`, migrar jornadas para Playwright Test e separar gates rápido, principal e completo. Baselines visuais exigem aprovação do Product Owner.

## Consequências

Mudanças visuais passam a produzir evidência reproduzível. O custo inicial aumenta e o conjunto de browser precisa ser calibrado contra flakiness. O smoke antigo permanece durante a migração.
