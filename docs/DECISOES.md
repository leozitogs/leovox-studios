# Registro de decisões

Decisões travadas durante o build, em ordem cronológica. Onde este registro
divergir do contexto compactado, o registro mais recente vence.

## 2026-06-10 · Entregável 1 (scaffolding e repositório)

1. **Nome do repositório: `leovox-studios`.** Segue a recomendação da Seção 9A
   do contexto para não fragmentar. A pasta local pode ter outro nome; o
   `package.json` e o remoto usam `leovox-studios`.
2. **Lenis sucessor.** O briefing pedia `@studio-freight/lenis`, que foi
   descontinuado (parou na 1.0.42). Usamos o sucessor oficial `lenis` (1.3.x).
   Aprovado pelo Product Owner.
3. **Totem = o mascote, não o monólito** (decisão herdada do briefing,
   registrada aqui por afetar `src/canvas/Totem.tsx`).
4. **v1 é desktop apenas.** Mobile fica para a v2; no mobile, o scroll será o
   gatilho garantido de toda revelação.
5. **Documentos de marca em `docs/marca/`, verbatim.** São cópias de referência
   da identidade Leovox. Por serem material de referência (e não conteúdo
   produzido neste repositório), ficam fora da varredura de travessão, do
   Prettier e do ESLint.
6. **Documentos comerciais ficam fora do repo.** Contratos, funil, ICP, tabela
   comercial e e-mails de prospecção são material sensível e não alimentam o
   build do portfólio.
7. **Sem husky/hooks de git.** Somente o Product Owner faz commit; o portão de
   qualidade é `npm run validate`, rodado manualmente e repetido no CI.
8. **As 4 frentes ainda sem nome no código.** O tipo `Frente` em
   `src/data/projects.ts` fica aberto até o briefing da cena Pilares.

## 2026-06-10 · Visibilidade e licença

9. **Repositório público com licença proprietária.** O repo nasce público como
   prova de processo (commits, branches, CI), protegido por `LICENSE` de
   código visível, todos os direitos reservados. A proteção real da marca e
   do mascote é registro de marca, caminho separado do repositório.
10. **Documentos de identidade fora do repo.** `docs/marca/` foi removido antes
    do primeiro commit: brand manual, tom de voz e roteiro contam o filme antes
    da estreia e são estratégia interna. Vivem na base de identidade local da
    Leovox. O contexto compactado permanece como briefing operacional do build.
