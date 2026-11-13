# Papéis da squad

Os 15 papéis em `harness/roles/` são módulos de competência do harness, escritos sem depender de ferramenta. O Claude Code os recebe como subagentes em `.claude/agents/`, gerados por `npm run harness:sync`; as outras ferramentas leem o arquivo do papel direto. O catálogo em `harness/agents/catalog.json` transforma descrições livres em decisões verificáveis de roteamento, dependências e evidências.

## Ciclo

1. O roteador lê arquivos alterados e o resumo da tarefa.
2. Planejadores produzem specs antes de código quando o risco exige.
3. Builders trabalham dentro do próprio domínio e entregam evidência.
4. O Brand Guard e o A11y Auditor avaliam toda entrega com contexto novo.
5. O Performance Watchdog entra quando assets, canvas, dependências, Vite ou orçamento mudam.
6. O Conductor entra quando três ou mais domínios são afetados ou quando a própria governança de agentes muda.

## Comandos

```bash
npm run agents:validate
npm run agents:route -- --base=cena/pilares --task="construir harness frontend"
```

Paths podem ser informados diretamente depois de `--` para diagnosticar uma rota sem Git.

## Handoff obrigatório

Cada especialista retorna quatro campos (definidos em `harness/agents/contrato-comum.md`):

- `summary`: conclusão curta.
- `evidence`: arquivos, testes, screenshots ou medições.
- `risks`: incertezas e limites do resultado.
- `followUps`: trabalho realmente restante.

Reviewer não altera a implementação que avalia. Ele aponta evidência e severidade; o builder responsável corrige e devolve para nova avaliação.

## Catálogo e fontes

O Markdown em `harness/roles/` é a instrução completa do papel, com frontmatter só de `name` e `description`. O JSON contém os metadados operacionais e, no bloco `claude`, as ferramentas e o modelo do subagente. As regras que valem para todos os papéis ficam em `harness/agents/contrato-comum.md` e são anexadas a cada subagente gerado. `npm run agents:validate` falha se um agente existir em apenas um dos lados, se uma dependência não existir ou se revisores obrigatórios ganharem permissão de escrita em produção.
