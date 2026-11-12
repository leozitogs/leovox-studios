# Plano concluído: previews de projetos nos Pilares

## Objetivo

Transformar os três quadros de Pilares em uma narrativa horizontal de trabalhos reais, com estruturas visuais prontas para receber os assets definitivos de Identidade & Design, Presença Digital e Tecnologia & Automação.

## Escopo entregue

- O cartaz, a travessia horizontal e a navegação 01 a 03 foram preservados.
- Cada pilar ganhou uma composição editorial própria e slots de asset substituíveis.
- Identidade recebeu prancheta, key visual, símbolo, aplicações e alternância entre resultado e construção.
- Presença recebeu pilha de formatos, seleção 9:16, 1:1 e 16:9 e playhead editorial.
- Tecnologia recebeu fluxo em três etapas, desktop, mobile, vídeo e execução interativa.
- Imagens e vídeos reais podem ser ligados apenas preenchendo `src/scenes/Pilares/frentes.ts`.
- O manifesto de entrega dos arquivos vive em `public/works/pilares/README.md`.

## Critérios

- [x] Existem exatamente três previews de projetos, um por pilar oficial.
- [x] Cada preview declara os assets que ainda precisa receber.
- [x] Identidade apresenta key visual, aplicações e sistema gráfico.
- [x] Presença apresenta formatos editoriais e edição de vídeo.
- [x] Tecnologia apresenta interface, fluxo e execução demonstrável.
- [x] O conteúdo entra por composição e transformação, sem fade simples como gesto principal.
- [x] Ida, reverse, navegação e reduced motion terminam em estados legíveis.
- [x] A geometria permanece válida de tablet a 4K.

## Evidências

- `npm run check:fast`: contratos, agentes, tipos, lint e 20 testes aprovados.
- `npm run validate`: checagem de conteúdo, formato, 20 testes e build aprovados.
- `npm run test:browser:chromium -- --workers=1`: 29 testes aprovados e 10 skips deliberados.
- Responsividade aprovada em tablet retrato, tablet paisagem, Full HD, 2K, 2.5K, ultrawide e 4K.
- Revisão visual aprovada nos três beats em 1600 x 900 e no primeiro beat em 1024 x 768.

## Riscos e limites

- Os assets reais podem exigir ajustes localizados de crop e contraste.
- O peso final depende da duração, codec e resolução dos vídeos entregues.
- A rodada mantém o foco de interação em tablet e desktop; mobile valida estrutura e leitura básica.

## Trabalho restante

- Receber um trabalho aprovado para cada pilar.
- Preparar os exports conforme `public/works/pilares/README.md`.
- Preencher os caminhos, nomes, categorias e resumos em `src/scenes/Pilares/frentes.ts`.
