-- Empresas emissoras (configuração fiscal de cada tenant)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cnpj VARCHAR(18) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  inscricao_municipal VARCHAR(50),
  regime_tributario VARCHAR(50),
  aliquota_iss DECIMAL(5,2) DEFAULT 2.00,
  codigo_servico VARCHAR(20),
  descricao_servico_padrao TEXT,
  rps_serie VARCHAR(10),
  rps_numero_atual INTEGER DEFAULT 1,
  email VARCHAR(255),
  telefone VARCHAR(20),
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cep VARCHAR(10),
  municipio VARCHAR(100),
  uf VARCHAR(2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);