# Plataforma SaaS NFS-e (Prompt Mestre v2.0)

Este repositório contém a base inicial de arquitetura e bootstrap para uma plataforma SaaS de emissão de NFS-e multi-tenant, white label, com foco inicial em Goiânia/GO (ABRASF 2.0).

## Estrutura

- `backend/`: API NestJS (a implementar em fases)
- `frontend/`: App Next.js (a implementar em fases)
- `infra/`: Docker Compose e artefatos de infraestrutura local
- `docs/`: documentação de arquitetura (SAD), DER e OpenAPI
- `.github/workflows/`: pipeline CI/CD inicial

## Status atual

Esta entrega inicial cobre:

1. Documento de Arquitetura de Software (SAD) com visão C4 e decisões arquiteturais.
2. DER textual completo baseado na especificação de tabelas.
3. OpenAPI 3.0 inicial para os principais módulos.
4. Estratégia de infraestrutura e riscos técnicos.
5. Bootstrap de ambiente local com Docker Compose.

## Próximos passos

Ver `docs/roadmap-fases.md` para os marcos de implementação Fase 0 a Fase 5.
