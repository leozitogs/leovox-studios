# Leovox Portfolio: mapa para agentes

Leia este arquivo antes de alterar o repositório. Ele aponta para a fonte de verdade; detalhes ficam nos documentos vinculados.

## Comece aqui

1. `ARCHITECTURE.md`: limites do sistema e mapa do código.
2. `docs/PIPELINE.md`: ordem e estado das cenas.
3. `docs/harness/README.md`: ciclo de desenvolvimento e níveis de validação.
4. `docs/scene-contracts/`: comportamento executável de cada cena.
5. `docs/harness/AGENTS.md`: roteamento dos especialistas e formato de handoff.
6. `CONTRIBUTING.md`: marca, animação, Git e revisão do Product Owner.

## Comandos obrigatórios

- Durante a implementação: `npm run check:fast`
- Antes de planejar: `npm run agents:route -- --base=<base> --task="<objetivo>"`
- Ao alterar agentes: `npm run agents:validate`
- Antes de entregar: `npm run validate`
- Mudança visual ou de movimento: `npm run test:browser:chromium`
- Auditoria completa: `npm run test:browser`

## Regras que não podem regredir

- Existem três pilares oficiais: Identidade & Design, Presença Digital e Tecnologia & Automação.
- Produção de conteúdo e edição de vídeo pertencem a Presença Digital.
- Travessão não entra em conteúdo, código, documentação, commits ou PRs.
- Movimento scrubado precisa ser função determinística do progresso e funcionar no reverse.
- Timeline deve usar alvos referenciados e valores explícitos.
- `prefers-reduced-motion` precisa oferecer uma experiência completa sem pin.
- O agente que altera uma referência visual não aprova a própria referência.

## Ao terminar uma tarefa

Registre objetivo, evidências, comandos executados, riscos e trabalho restante no plano ativo em `docs/plans/active/`. Mova o plano para `docs/plans/completed/` quando todos os critérios passarem.
