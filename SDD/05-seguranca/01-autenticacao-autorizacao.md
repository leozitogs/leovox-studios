# 5.1 Autenticação e autorização

## Estado atual

O portfólio é um site público estático. Não há login, conta, sessão nem dado de
usuário. Logo, não existe autenticação nem autorização a implementar na v1.

## Acesso ao código

O repositório é público sob LICENSE proprietária (código visível para avaliação,
todos os direitos reservados). A proteção da marca e do mascote é registro de
marca, caminho separado do repositório (ver `docs/DECISOES.md`).

## Planejado (se entrar formulário de contato)

Se o Contato ganhar um formulário com backend, o padrão será: sem login,
processamento via serviço de terceiro (por exemplo um endpoint serverless de
formulário), sem armazenar dado sensível no front. Qualquer integração que
precise de chave usa variável de ambiente, nunca commitada.

Relacionado: [02-controles-seguranca](02-controles-seguranca.md).
