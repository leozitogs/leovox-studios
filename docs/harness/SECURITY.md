# Segurança do harness

- Agentes trabalham em branch ou worktree isolada.
- Segredos nunca entram em prompt, log, fixture ou screenshot.
- Instalação de dependência exige justificativa e revisão do lockfile.
- `npm ci` é a instalação canônica no CI.
- Ferramentas recebem o menor acesso necessário.
- Testes externos usam destinos permitidos explicitamente; o site local não depende da rede.
- Mudança que introduza formulário, autenticação, upload ou conteúdo remoto exige revisão baseada no OWASP ASVS.

Falha de auditoria de dependência deve indicar pacote, alcance no produto e correção disponível. O número bruto de avisos não substitui análise de impacto.
