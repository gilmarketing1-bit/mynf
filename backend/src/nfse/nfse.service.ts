import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class NfseService {
  private getClient() {
    return new Client({ connectionString: process.env.DATABASE_URL });
  }

  async findByTenant(tenantId: string, filters: any = {}) {
    const client = this.getClient();
    await client.connect();
    try {
      let query = `
        SELECT n.*, c.razao_social as tomador_nome, c.cnpj as tomador_cnpj
        FROM nfse n
        LEFT JOIN clients c ON c.id = n.client_id
        WHERE n.tenant_id = $1
      `;
      const params: any[] = [tenantId];
      let idx = 2;

      if (filters.status) {
        query += ` AND n.status = $${idx++}`;
        params.push(filters.status);
      }
      if (filters.dataInicio) {
        query += ` AND n.data_emissao >= $${idx++}`;
        params.push(filters.dataInicio);
      }
      if (filters.dataFim) {
        query += ` AND n.data_emissao <= $${idx++}`;
        params.push(filters.dataFim);
      }

      query += ` ORDER BY n.data_emissao DESC`;
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      await client.end();
    }
  }

  async findOne(id: string, tenantId: string) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `SELECT n.*, c.razao_social as tomador_nome, c.cnpj as tomador_cnpj
         FROM nfse n
         LEFT JOIN clients c ON c.id = n.client_id
         WHERE n.id = $1 AND n.tenant_id = $2`,
        [id, tenantId]
      );
      if (result.rows.length === 0) throw new NotFoundException('NFS-e não encontrada');
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  async create(tenantId: string, dto: any) {
    const client = this.getClient();
    await client.connect();
    try {
      // Busca próximo número RPS da empresa
      const companyResult = await client.query(
        `SELECT rps_serie, rps_numero_atual FROM companies WHERE id = $1 AND tenant_id = $2`,
        [dto.companyId, tenantId]
      );
      const company = companyResult.rows[0];
      const numeroRps = company?.rps_numero_atual || 1;
      const serieRps = company?.rps_serie || '1';

      // Calcula valores
      const valorServico = parseFloat(dto.valorServico) || 0;
      const aliquotaIss = parseFloat(dto.aliquotaIss) || 2.00;
      const valorIss = (valorServico * aliquotaIss) / 100;
      const valorLiquido = valorServico - valorIss;

      const result = await client.query(
        `INSERT INTO nfse (
          tenant_id, company_id, client_id,
          numero_rps, serie_rps, data_competencia,
          codigo_servico, descricao_servico,
          valor_servico, aliquota_iss, valor_iss,
          valor_base_calculo, valor_liquido,
          regime_tributario, status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'RASCUNHO')
        RETURNING *`,
        [
          tenantId, dto.companyId, dto.clientId,
          numeroRps, serieRps, dto.dataCompetencia,
          dto.codigoServico, dto.descricaoServico,
          valorServico, aliquotaIss, valorIss,
          valorServico, valorLiquido,
          dto.regimeTributario,
        ]
      );

      // Incrementa número RPS da empresa
      await client.query(
        `UPDATE companies SET rps_numero_atual = rps_numero_atual + 1 WHERE id = $1`,
        [dto.companyId]
      );

      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  async dashboard(tenantId: string) {
  const client = this.getClient();
  await client.connect();
  try {
    const result = await client.query(
      `SELECT
        -- Emissões
        COUNT(*) FILTER (WHERE status = 'EMITIDA') as total_emitidas,
        COUNT(*) FILTER (WHERE status = 'REJEITADA') as total_rejeitadas,
        COUNT(*) FILTER (WHERE status = 'CANCELADA') as total_canceladas,
        COUNT(*) FILTER (WHERE status = 'RASCUNHO') as total_rascunhos,
        COUNT(*) FILTER (WHERE status = 'EMITIDA' AND DATE_TRUNC('day', data_emissao) = CURRENT_DATE) as emitidas_hoje,

        -- Faturamento
        COALESCE(SUM(valor_servico) FILTER (WHERE status = 'EMITIDA'), 0) as faturamento_mes,
        COALESCE(SUM(valor_iss) FILTER (WHERE status = 'EMITIDA'), 0) as iss_estimado,

        -- Recebíveis — os 4 status
        COALESCE(SUM(valor_servico) FILTER (
          WHERE status = 'EMITIDA' AND pago = true
        ), 0) as total_recebido,

        COALESCE(SUM(valor_servico) FILTER (
          WHERE status = 'EMITIDA' AND pago = false
          AND data_vencimento IS NOT NULL
          AND data_vencimento < CURRENT_DATE
        ), 0) as total_em_atraso,

        COALESCE(SUM(valor_servico) FILTER (
          WHERE status = 'EMITIDA' AND pago = false
          AND data_vencimento = CURRENT_DATE
        ), 0) as total_vence_hoje,

        COALESCE(SUM(valor_servico) FILTER (
          WHERE status = 'EMITIDA' AND pago = false
          AND data_vencimento > CURRENT_DATE
          AND data_vencimento <= (CURRENT_DATE + INTERVAL '30 days')
        ), 0) as total_a_vencer_30d,

        COALESCE(SUM(valor_servico) FILTER (
          WHERE status = 'EMITIDA' AND pago = false
          AND (data_vencimento IS NULL OR data_vencimento > CURRENT_DATE + INTERVAL '30 days')
        ), 0) as total_pendente,

        -- Contagens para alertas
        COUNT(*) FILTER (
          WHERE status = 'EMITIDA' AND pago = false
          AND data_vencimento IS NOT NULL
          AND data_vencimento < CURRENT_DATE
        ) as qtd_em_atraso,

        COUNT(*) FILTER (
          WHERE status = 'EMITIDA' AND pago = false
          AND data_vencimento = CURRENT_DATE
        ) as qtd_vence_hoje

       FROM nfse
       WHERE tenant_id = $1
       AND DATE_TRUNC('month', data_emissao) = DATE_TRUNC('month', CURRENT_DATE)`,
      [tenantId]
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
}
}