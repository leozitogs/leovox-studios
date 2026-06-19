# 5.2 Controles de segurança

A superfície de ataque é mínima por ser site estático. Controles vigentes e
planejados:

## Dependências

- `package-lock.json` versionado; o CI usa `npm ci`.
- Higiene com `npm audit`; nenhuma lib de efeito banido no `package.json`.

## Segredos

- Nenhum segredo no repositório. Token ou chave (futuro) só em variável de ambiente da hospedagem.
- `docs/DECISOES.md` é local e fora do versionamento; o brand manual vive fora do repo.

## Entrega

- HTTPS pela hospedagem. Cabeçalhos de segurança (CSP, X-Content-Type-Options e afins) configuráveis na hospedagem no deploy.

## Conteúdo

- Sem PII coletada na v1. Se entrar formulário, validar e sanitizar a entrada e usar proteção anti-spam.

## Marca como ativo

- Os masters (mascote em mov, fontes trial) ficam fora do build público; só os derivados necessários entram em `public/`.

Relacionado: [01-autenticacao-autorizacao](01-autenticacao-autorizacao.md), [../07-operacional/01-deploy](../07-operacional/01-deploy.md).
