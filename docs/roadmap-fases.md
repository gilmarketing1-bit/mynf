# Roadmap de Implementação — Prompt Mestre v2.0

## Fase 0 — Infraestrutura (concluída parcialmente)
- [x] Monorepo estruturado.
- [x] Docker Compose com PostgreSQL, Redis, MinIO, backend, frontend e Nginx.
- [x] Scaffold inicial backend (NestJS) e frontend (Next.js).
- [x] Guide de deploy OCI (`docs/oci-deploy.md`).
- [ ] Migrations completas de todas as tabelas.
- [ ] RLS completo com testes de integração.

## Fase 1 — Backend Core
- Auth completo (JWT, refresh, 2FA, lock por tentativas).
- Multi-tenancy com TenantInterceptor + RLS.
- RBAC por perfil.
- CRUDs principais.
- Módulo de certificados com criptografia AES-256-GCM.

## Fase 2 — Frontend
- Design system white label.
- Wizard de onboarding 5 passos.
- Dashboard e emissão rápida.

## Fase 3 — Integração Fiscal Goiânia
- XML ABRASF 2.0/2.02 + XSD validation.
- Assinatura digital.
- Emissão, consulta, cancelamento.
- Fila assíncrona e anti-duplicata.

## Fase 4 — Billing e White Label
- Adapter de gateway (PIX/cartão/boleto).
- Webhooks de ativação.
- Regras de grupo econômico e portfólio.

## Fase 5 — IA e Relatórios
- Assistente contextual e tradutor de erros.
- Relatórios e exportações XLSX/PDF.
