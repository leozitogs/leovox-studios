# Avaliação de agentes e mudanças

## Unidade de avaliação

Uma tarefa contém estado inicial, objetivo, referências, viewports, estados observáveis, critérios de aceite e ações proibidas. O grader avalia o resultado no repositório e no browser, sem exigir um caminho interno específico.

## Scorecard

| Dimensão | Peso |
| --- | ---: |
| Função | 25 |
| Fidelidade visual | 20 |
| Movimento | 20 |
| Acessibilidade | 10 |
| Performance | 10 |
| Arquitetura | 5 |
| Marca | 5 |
| Manutenibilidade | 5 |

Erros de console, 404 de asset, jornada crítica quebrada, estado sujo no reverse ou falha grave de segurança vetam a entrega independentemente da soma.

## Benchmark interno

O conjunto alvo tem 30 tarefas reais: 6 funcionais, 6 visuais, 6 de movimento, 4 responsivas, 3 de acessibilidade, 3 de performance e 2 de arquitetura ou marca. Parte fica em holdout. Cada tarefa roda mais de uma vez quando o objetivo é medir capacidade do agente.

Métricas: pass@1, pass@3, duração, custo, ciclos de correção, regressões, intervenção humana, tamanho do diff, mudança fora do escopo, flakiness, desacordo entre grader e Product Owner e taxa de tarefas defeituosas.
