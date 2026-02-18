# Plataforma SaaS NFS-e (Prompt Mestre v2.0)

Este repositório contém a base operacional inicial para uma plataforma SaaS de emissão de NFS-e multi-tenant, white label, com foco inicial em Goiânia/GO (ABRASF 2.0).

## Estrutura

- `backend/`: API NestJS (módulos iniciais: health, auth, tenant, companies)
- `frontend/`: App Next.js 14 (home, login e dashboard inicial)
- `infra/`: Docker Compose, Nginx e artefatos de infraestrutura local
- `docs/`: documentação de arquitetura (SAD), DER, OpenAPI e deploy OCI
- `.github/workflows/`: pipeline CI/CD

## Subida local

```bash
cp .env.example .env
cd infra
docker compose --env-file ../.env up -d --build
```

Acesse:
- Frontend: `http://localhost`
- API health: `http://localhost/api/health`

## Oracle Cloud Free Tier

Ver guia detalhado em `docs/oci-deploy.md`.

## Próximos passos

Ver `docs/roadmap-fases.md` para evolução Fase 0 a Fase 5.
