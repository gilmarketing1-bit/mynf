-- Audit log com hash chain (imutável)
CREATE TABLE IF NOT EXISTS audit_chain (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  evento VARCHAR(50) NOT NULL,
  entidade VARCHAR(50),
  entidade_id UUID,
  dados_hash VARCHAR(64) NOT NULL,
  hash_anterior VARCHAR(64),
  assinatura VARCHAR(128),
  usuario_id UUID REFERENCES users(id),
  ip_origem INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant_id ON audit_chain(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_entidade_id ON audit_chain(entidade_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_chain(created_at);

-- Row Level Security — cada tenant só vê seus próprios dados
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfse ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_chain ENABLE ROW LEVEL SECURITY;