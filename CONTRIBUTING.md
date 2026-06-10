# Contribuindo · Contrato de trabalho

Este repositório segue o contrato definido no contexto compactado v1.0
(`docs/leovox-portfolio-contexto-compactado-v1_0.md`). Qualquer conversa nova
de build assume estes papéis.

## Papéis

| Papel          | Responsabilidade                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Fable 5 | Designer de produto, engenheiro de prompt e assistente pessoal. Define direção, organiza o trabalho cena a cena, explica cada decisão. |
| Claude Code    | Programador efetivo. Escreve o código contra o servidor de desenvolvimento.                                                            |
| Leonardo       | Product Owner. Aprova cada etapa, faz o design dos protótipos.                                                                         |

## Regras de execução (inegociáveis)

1. **Um prompt por entregável.** Nada de prompt gigante multi-camada.
2. **Pausa obrigatória antes de codar:** apresentar o plano (arquivos, libs,
   versões) e esperar aprovação por escrito do Product Owner.
3. **Validar no servidor existente em `:5173`.** Nunca subir instância Vite própria.
4. **Screenshot é evidência, não aprovação.** Só avançar com aprovação explícita
   por escrito.
5. **Prototipagem antes de codar** quando a cena for visual e dependente de movimento.
6. **Sem travessão** em nenhuma string, comentário ou copy. `npm run check:travessao`
   obrigatório antes de propor commit.

## Git

Somente o Product Owner faz commit e push. O Claude Code nunca executa
`git commit` nem `git push`. Ele propõe uma mensagem de commit (imperativo,
em inglês) para o Product Owner usar.

## Portão de qualidade

Antes de qualquer commit:

```
npm run validate
```

Roda, nesta ordem: checagem de travessão, typecheck, lint, checagem de
formatação, testes de marca e build. O CI repete tudo em cada push e PR.

## Regras de marca no código

1. Paleta oficial: `#000000`, `#222222`, `#19BC00`, `#FBFBFB`, `#FFFFFF`,
   mais o verde pastel `#C5F49D` de apoio. A paleta orienta, não aprisiona.
2. O verde `#19BC00` é cor estrutural, aplicada chapada. Nunca efeito.
3. Efeitos banidos: glow, neon, bloom, halo, glitch, scanline, RGB split,
   holograma, código binário decorativo, ruído digital. Grafite genérico
   banido; assinatura própria autêntica liberada.
4. Permitido e incentivado: halftone e serigrafia.
5. Corte proibido: nenhum reload visível entre cenas.

A documentação completa da marca (brand manual, tom de voz, mascote, direção
criativa) vive fora deste repositório, na base de identidade da Leovox Studios.
Este repositório é público sob licença proprietária: veja o arquivo `LICENSE`.
