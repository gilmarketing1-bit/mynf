# DER — Modelo Entidade-Relacionamento (Textual)

## Entidades principais
- tenants (1) — (N) accounts
- tenants (1) — (N) users
- tenants (1) — (N) companies
- tenants (1) — (N) clients
- tenants (1) — (N) nfse
- accounts (1) — (N) users
- accounts (1) — (N) company_groups
- accounts (1) — (N) companies
- company_groups (1) — (N) companies
- companies (1) — (N) clients
- companies (1) — (N) nfse
- companies (1) — (1) digital_certificates (ativo)
- billing_plans (1) — (N) accounts
- accounts (1) — (N) billing_invoices
- companies (0..1) — (N) billing_invoices

## Tabelas obrigatórias
1. `tenants`
2. `accounts`
3. `users`
4. `company_groups`
5. `companies`
6. `digital_certificates`
7. `clients`
8. `nfse`
9. `billing_plans`
10. `billing_invoices`
11. `audit_logs`
12. `municipal_configs`

## Regras de integridade
- Todas as tabelas multi-tenant devem ter `tenant_id` + índice composto com chave de negócio.
- `audit_logs` é append-only: sem UPDATE/DELETE na aplicação.
- `companies.cnpj` único por `tenant_id`.
- `users.email` único por `tenant_id` (preferível) ou global com validação de domínio da conta.
- `nfse` deve impedir duplicidade de RPS por empresa (`UNIQUE(company_id, rps_serie, rps_numero)`).
- `billing_invoices` deve manter rastreabilidade de método e referência externa de pagamento.

## Índices recomendados
- `accounts(tenant_id, billing_status)`
- `users(tenant_id, email)`
- `companies(tenant_id, cnpj)`
- `clients(tenant_id, company_id, document)`
- `nfse(tenant_id, company_id, status, competencia)`
- `nfse(company_id, rps_serie, rps_numero)` UNIQUE
- `audit_logs(tenant_id, occurred_at desc)`

## Políticas RLS (resumo)
Para cada tabela com `tenant_id`:
- USING: `tenant_id = current_setting('app.current_tenant_id')::uuid`
- WITH CHECK: mesma condição

Exceções:
- tabelas de catálogo global podem ser somente leitura e sem tenant.
