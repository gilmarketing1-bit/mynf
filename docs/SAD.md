# SAD — Software Architecture Document

## 1. Objetivo
Projetar uma plataforma SaaS de emissão de NFS-e multi-tenant, white label, com núcleo municipal plugável e foco inicial em Goiânia/GO (ABRASF 2.0/2.02).

## 2. Escopo e premissas
- Backend em NestJS + TypeScript estrito.
- Frontend em Next.js App Router.
- Isolamento por tenant no nível aplicação e banco (RLS).
- Integração SOAP com prefeitura via adaptadores municipais.

## 3. Arquitetura C4

### 3.1 Nível Contexto
Atores:
- Empresário
- Contador (portfólio)
- Revendedor white label

Sistema:
- Plataforma NFS-e SaaS (frontend + backend)

Sistemas externos:
- Prefeitura de Goiânia (WS SOAP)
- Gateway de pagamento
- BrasilAPI (consulta CNPJ)
- S3/MinIO
- Provedor de e-mail

### 3.2 Nível Container
- **Frontend (Next.js)**: dashboard, onboarding wizard, emissão, billing, relatórios, IA.
- **Backend (NestJS)**: auth, tenant, emissão, fiscal, billing, IA, relatórios.
- **PostgreSQL 16**: dados transacionais com RLS.
- **Redis 7**: cache, blacklist JWT, BullMQ.
- **MinIO/S3**: XML, PDF, certificado criptografado.

### 3.3 Nível Componente (Backend)
- `AuthModule`: JWT access/refresh, TOTP, lockout, rotação.
- `TenantModule`: resolução por JWT/domain + interceptor `SET app.current_tenant_id`.
- `CompanyModule`: empresas, grupos, portfólio.
- `CertificateModule`: upload, parse PFX, criptografia AES-256-GCM.
- `NfseModule`: ciclo DRAFT→ISSUED/REJECTED/CANCELLED.
- `MunicipioAdapterRegistry`: seleção por `municipio_ibge_code`.
- `BillingModule`: planos, faturas, integração adapter gateway.
- `AiModule`: chat contextual e tradutor de rejeições.
- `ReportModule`: consultas agregadas + exportação.
- `AuditModule`: eventos imutáveis.

### 3.4 Nível Código (Emissão)
Fluxo resumido:
1. Validar nota/certificado/tomador/regras fiscais.
2. Reservar próximo RPS com lock transacional.
3. Gerar XML RPS e validar XSD.
4. Assinar XML.
5. Enviar ao WS com retry seguro e consulta anti-duplicata por RPS.
6. Persistir sucesso/rejeição.
7. Enfileirar pós-emissão (PDF/email).

## 4. Decisões arquiteturais chave
1. **RLS obrigatório** em tabelas com `tenant_id`.
2. **Adapter municipal** para evitar acoplamento por cidade.
3. **Retry com idempotência operacional** via consulta por RPS antes de reenvio.
4. **Criptografia de certificado com chaves independentes** para arquivo e senha.
5. **Eventos de auditoria imutáveis** para trilha de conformidade.

## 5. Requisitos não-funcionais
- Segurança: JWT rotativo, 2FA, rate limit, RLS, LGPD.
- Observabilidade: Sentry + logs estruturados + healthcheck.
- Escalabilidade: API stateless horizontal + workers separados.
- Disponibilidade: filas para desacoplar integrações externas instáveis.

## 6. Estratégia de infraestrutura (Oracle Cloud Free Tier)
- OCI Compute VM Always Free (Ubuntu) com Docker Compose
- PostgreSQL 16 em container (inicial) com volume persistente
- Redis 7 em container
- MinIO para objetos em ambiente inicial
- Nginx para reverse proxy e terminação TLS
- OCI DNS (ou provedor externo) para domínio

Sizing inicial (MVP):
- 1 VM Always Free com backend, frontend, postgres, redis, minio e nginx
- Escala vertical inicial + otimização de processos
- Evolução futura: separar banco e mover para serviço gerenciado conforme crescimento

## 7. Riscos técnicos e mitigação
1. Instabilidade WS prefeitura: timeout, retry exponencial, circuit breaker, fila.
2. Assinatura digital/XSD: suíte de testes com fixtures reais de homologação.
3. Corrida de sequência RPS: lock transacional e teste de concorrência.
4. Duplicidade em falha de retorno: consulta por RPS antes de retry.
5. LGPD em multi-tenant: minimização de dados, export/delete auditados, segregação rígida.

## 8. Estimativa macro de esforço
- Fase 0: 80h
- Fase 1: 220h
- Fase 2: 180h
- Fase 3: 260h
- Fase 4: 160h
- Fase 5: 140h

Total estimado: 1.040h (sem contar homologação externa da prefeitura).
