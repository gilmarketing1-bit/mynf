# Backend (NestJS)

## Módulos iniciais
- `health`: endpoint de saúde
- `auth`: login com emissão de access/refresh token (base)
- `tenant`: interceptor para resolver tenant por header
- `companies`: CRUD em memória para validação inicial de fluxo

## Comandos
```bash
npm install
npm run start:dev
```

## Banco
- Migration inicial: `db/migrations/0001_init.sql`
- Inclui tabelas mínimas (`tenants`, `accounts`, `users`) e RLS base.
