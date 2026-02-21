import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class CompaniesService {
  private getClient() {
    return new Client({ connectionString: process.env.DATABASE_URL });
  }

  async findByTenant(tenantId: string) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `SELECT * FROM companies WHERE tenant_id = $1 AND status = 'active' ORDER BY created_at DESC`,
        [tenantId]
      );
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
        `SELECT * FROM companies WHERE id = $1 AND tenant_id = $2`,
        [id, tenantId]
      );
      if (result.rows.length === 0) throw new NotFoundException('Empresa não encontrada');
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  async create(tenantId: string, dto: any) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `INSERT INTO companies (
          tenant_id, cnpj, razao_social, nome_fantasia, inscricao_municipal,
          regime_tributario, aliquota_iss, codigo_servico, descricao_servico_padrao,
          rps_serie, rps_numero_atual, email, telefone,
          logradouro, numero, complemento, bairro, cep, municipio, uf
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
        ) RETURNING *`,
        [
          tenantId,
          dto.cnpj, dto.razaoSocial, dto.nomeFantasia, dto.inscricaoMunicipal,
          dto.regimeTributario, dto.aliquotaIss || 2.00,
          dto.codigoServico, dto.descricaoServicoPadrao,
          dto.rpsSerie || '1', dto.rpsNumeroAtual || 1,
          dto.email, dto.telefone,
          dto.logradouro, dto.numero, dto.complemento,
          dto.bairro, dto.cep, dto.municipio, dto.uf,
        ]
      );
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  async update(id: string, tenantId: string, dto: any) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `UPDATE companies SET
          razao_social = COALESCE($3, razao_social),
          nome_fantasia = COALESCE($4, nome_fantasia),
          inscricao_municipal = COALESCE($5, inscricao_municipal),
          regime_tributario = COALESCE($6, regime_tributario),
          aliquota_iss = COALESCE($7, aliquota_iss),
          codigo_servico = COALESCE($8, codigo_servico),
          descricao_servico_padrao = COALESCE($9, descricao_servico_padrao),
          rps_serie = COALESCE($10, rps_serie),
          rps_numero_atual = COALESCE($11, rps_numero_atual),
          email = COALESCE($12, email),
          telefone = COALESCE($13, telefone),
          logradouro = COALESCE($14, logradouro),
          numero = COALESCE($15, numero),
          complemento = COALESCE($16, complemento),
          bairro = COALESCE($17, bairro),
          cep = COALESCE($18, cep),
          municipio = COALESCE($19, municipio),
          uf = COALESCE($20, uf),
          updated_at = NOW()
        WHERE id = $1 AND tenant_id = $2
        RETURNING *`,
        [
          id, tenantId,
          dto.razaoSocial, dto.nomeFantasia, dto.inscricaoMunicipal,
          dto.regimeTributario, dto.aliquotaIss,
          dto.codigoServico, dto.descricaoServicoPadrao,
          dto.rpsSerie, dto.rpsNumeroAtual,
          dto.email, dto.telefone,
          dto.logradouro, dto.numero, dto.complemento,
          dto.bairro, dto.cep, dto.municipio, dto.uf,
        ]
      );
      if (result.rows.length === 0) throw new NotFoundException('Empresa não encontrada');
      return result.rows[0];
    } finally {
      await client.end();
    }
  }
}