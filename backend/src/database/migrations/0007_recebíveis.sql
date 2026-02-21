-- Campos de controle financeiro nas NFS-e
ALTER TABLE nfse ADD COLUMN IF NOT EXISTS data_vencimento DATE;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_nfse_data_vencimento ON nfse(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_nfse_pago ON nfse(pago);