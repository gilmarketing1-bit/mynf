-- Tomadores de serviço (clientes dos tenants)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cnpj VARCHAR(18),
  cpf VARCHAR(14),
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  inscricao_municipal VARCHAR(50),
  regime_tributario VARCHAR(50),
  email VARCHAR(255),
  telefone VARCHAR(20),
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cep VARCHAR(10),
  municipio VARCHAR(100),
  uf VARCHAR(2),
  aliquota_iss_especial DECIMAL(5,2),
  retencao_iss BOOLEAN DEFAULT FALSE,
  retencao_inss BOOLEAN DEFAULT FALSE,
  retencao_ir BOOLEAN DEFAULT FALSE,
  retencao_csll BOOLEAN DEFAULT FALSE,
  retencao_pis BOOLEAN DEFAULT FALSE,
  retencao_cofins BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_cnpj ON clients(cnpj);