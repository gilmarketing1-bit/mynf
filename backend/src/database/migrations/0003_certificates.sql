-- Certificados digitais (A1 .pfx criptografado AES-256)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  pfx_encrypted BYTEA NOT NULL,
  iv VARCHAR(64) NOT NULL,
  auth_tag VARCHAR(64) NOT NULL,
  validade TIMESTAMPTZ NOT NULL,
  tipo VARCHAR(10) DEFAULT 'A1',
  status VARCHAR(50) DEFAULT 'active',
  alerta_90_enviado BOOLEAN DEFAULT FALSE,
  alerta_60_enviado BOOLEAN DEFAULT FALSE,
  alerta_30_enviado BOOLEAN DEFAULT FALSE,
  alerta_7_enviado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificates_tenant_id ON certificates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_certificates_validade ON certificates(validade);