# Avaliação visual

## Quatro sinais

1. Screenshot para detectar regressão de pixels.
2. Âncoras geométricas para composição e alinhamento.
3. DOM e acessibilidade para estrutura e conteúdo.
4. Rubrica humana para hierarquia, matéria, atitude e fidelidade à direção criativa.

Pixel diff sozinho não decide qualidade. Uma imagem pode ter poucos pixels diferentes e composição errada; também pode ter ruído de renderização sem mudança perceptível.

## Baselines

- O autor da alteração gera a candidata e descreve a mudança.
- O Product Owner aprova a referência visual.
- A referência registra cena, estado, viewport e hash do contrato.
- Atualização em massa exige justificativa por cena.
- O CI nunca atualiza screenshots automaticamente.

## Ambiente

Baselines oficiais usam Chromium instalado pelo Playwright no CI Linux. Baselines locais de Windows servem para diagnóstico e não devem substituir as oficiais sem revisão.
