# Plano concluído: fundação do harness frontend

## Objetivo

Construir a primeira fatia operacional do harness: mapa do repositório, contratos executáveis, controle determinístico do browser, matriz Playwright e gates de CI.

## Critérios

- [x] Orientação curta em `AGENTS.md` e arquitetura rastreável.
- [x] Documentos de visual, movimento, acessibilidade, performance, segurança e avaliação.
- [x] Contratos de Manifesto e Pilares validados por script.
- [x] API `window.__LEOVOX_HARNESS__` ativada sob demanda.
- [x] Testes Playwright passam nos projetos Chromium.
- [x] `npm run validate` passa.
- [x] Auditoria cross-browser registrada no workflow noturno.
- [x] Os 15 agentes de `.claude/agents` estão catalogados, roteáveis e validados.

## Evidências

- `npm run validate`: 4 arquivos e 20 testes Vitest aprovados, contratos aprovados e build concluído.
- `npm run test:browser:chromium`: 16 testes aprovados e 8 skips deliberados pela matriz.
- `npm run smoke`: console limpo, fluxo íntegro e assets respondendo.
- O harness detectou e a implementação corrigiu o canvas decorativo bloqueando cliques.
- O harness detectou e a implementação corrigiu o salto distante parando no pilar intermediário.
- `npm run agents:validate`: catálogo, dependências, revisores e cenários de roteamento aprovados.
- Bundle principal observado: 1.045.060 bytes minificado e 294.510 bytes gzip.

## Risco restante

Firefox e WebKit estão configurados no workflow noturno, mas a primeira execução no CI ainda precisa estabelecer o histórico de compatibilidade e flakiness.
