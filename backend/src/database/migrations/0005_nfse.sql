-- Notas Fiscais de Serviço Eletrônicas
CREATE TABLE IF NOT EXISTS nfse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id),
  client_id UUID REFERENCES clients(id),
  numero_nfse VARCHAR(50),
  numero_rps VARCHAR(50),
  serie_rps VARCHAR(10),
  data_emissao TIMESTAMPTZ DEFAULT NOW(),
  data_competencia DATE,
  codigo_servico VARCHAR(20),
  descricao_servico TEXT,
  valor_servico DECIMAL(15,2) NOT NULL,
  valor_deducoes DECIMAL(15,2) DEFAULT 0,
  valor_base_calculo DECIMAL(15,2),
  aliquota_iss DECIMAL(5,2),
  valor_iss DECIMAL(15,2),
  valor_iss_retido DECIMAL(15,2) DEFAULT 0,
  valor_inss DECIMAL(15,2) DEFAULT 0,
  valor_ir DECIMAL(15,2) DEFAULT 0,
  valor_csll DECIMAL(15,2) DEFAULT 0,
  valor_pis DECIMAL(15,2) DEFAULT 0,
  valor_cofins DECIMAL(15,2) DEFAULT 0,
  valor_liquido DECIMAL(15,2),
  regime_tributario VARCHAR(50),
  status VARCHAR(50) DEFAULT 'RASCUNHO',
  xml_original TEXT,
  xml_hash VARCHAR(64),
  chave_nfse VARCHAR(255),
  protocolo VARCHAR(100),
  erro_mensagem TEXT,
  pago BOOLEAN DEFAULT FALSE,
  forma_pagamento VARCHAR(50),
  data_pagamento TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nfse_tenant_id ON nfse(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nfse_client_id ON nfse(client_id);
CREATE INDEX IF NOT EXISTS idx_nfse_status ON nfse(status);
CREATE INDEX IF NOT EXISTS idx_nfse_data_emissao ON nfse(data_emissao);