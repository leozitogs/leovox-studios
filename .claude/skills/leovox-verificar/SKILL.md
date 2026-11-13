---
name: leovox-verificar
description: Roda os portões de qualidade do portfólio Leovox e a revisão independente de marca, acessibilidade e performance antes de entregar ao PO. Use antes de dizer que algo está pronto, antes de propor commit ou PR, e quando o PO pedir revisão, auditoria ou QA.
---
<!-- GERADO por npm run harness:sync a partir de .agents/skills/leovox-verificar/SKILL.md. Edite a fonte, não este arquivo. -->

# Verificar

Ninguém aprova o próprio trabalho. Esta skill junta prova determinística e revisão com olhos novos.

## 1. Portões determinísticos (nesta ordem)

```bash
npm run validate                 # travessão, harness, contratos, agentes, tipos, lint, formato, testes, build
npm run spec:trace -- --strict   # todo critério automático tem teste
npm run test:browser:chromium    # se mudou visual, responsivo ou movimento
npm run smoke                    # se mudou o filme inteiro ou um asset
```

Qualquer vermelho para a entrega. Escreva a falha no plano; não contorne.

## 2. Revisão independente

Revisor não é quem construiu e não corrige o que avalia: aponta evidência e severidade, e o builder
corrige.

- Claude Code: despache os subagentes `leovox-brand-guard` e `leovox-a11y-auditor` (sempre) e
  `leovox-performance-watchdog` (peso novo, canvas, dependência, Vite).
- Codex, Gemini, Antigravity: abra uma sessão nova, ou releia só o diff (`git diff main...`) sem o
  histórico da conversa, e aplique `harness/roles/leovox-brand-guard.md` e
  `harness/roles/leovox-a11y-auditor.md` ao pé da letra.

Cada revisor devolve o handoff do `harness/agents/contrato-comum.md`, com achados como
`arquivo:linha`, severidade (bloqueia, corrige agora, depois) e a regra violada.

## 3. Fechar

- Critérios `manual` do contrato viram uma lista de QA para o PO, com o que olhar e onde.
- Atualize o plano: critérios marcados, evidências, riscos.
- Entregue ao PO: o que mudou, arquivos, resultado dos portões, achados dos revisores, decisões
  pendentes e a mensagem de commit proposta.
