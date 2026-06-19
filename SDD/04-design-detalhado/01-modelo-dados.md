# 4.1 Modelo de dados

O portfólio é estático: não há banco nem API. O dado é conteúdo curado em
arquivos versionados.

## Fonte de dados

- `src/data/projects.ts`: a lista de projetos e o tipo de domínio. O tipo `Frente` (as 4 frentes da Leovox) fica aberto até o briefing da cena Pilares (ver `docs/DECISOES.md`).

## Entidade Projeto / Case (proposta canônica)

Cada projeto curado segue um schema tipado. Esboço:

```ts
interface Projeto {
  slug: string
  numero: string // "01", "02"
  nome: string
  cliente: string
  ano: number
  frente: Frente // identidade | presenca-digital | tech | crescimento
  resumo: string // curto, vira a tomada no Selected Projects
  thumb: { src: string; alt: string; aspect: '4/5' | '16/9' | '1/1' }
  galeria?: Array<{ src: string; alt: string }>
  resultado?: Array<{ metrica: string; valor: string }>
  proximo: string // slug do proximo case
}
```

## Conteúdo de cena

O texto canônico das cenas (Manifesto, headlines) vive no código da cena, citado
literal do `docs/PIPELINE.md`. Não é parametrizado: é conteúdo de marca, não dado.

## Assets

Os assets ficam em `public/` (animation, background, branding, fonts, models,
textures). O teste de existência de assets garante que todo caminho citado no
`src` existe no disco (ver [../06-testes/01-estrategia-testes](../06-testes/01-estrategia-testes.md)).

Relacionado: [02-design-modulos](02-design-modulos.md), [../03-arquitetura/01-visao-arquitetural](../03-arquitetura/01-visao-arquitetural.md).
