import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class ClientsService {
  private getClient() {
    return new Client({ connectionString: process.env.DATABASE_URL });
  }

  async findByTenant(tenantId: string) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `SELECT * FROM clients WHERE tenant_id = $1 AND status = 'active' ORDER BY razao_social ASC`,
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
        `SELECT * FROM clients WHERE id = $1 AND tenant_id = $2`,
        [id, tenantId]
      );
      if (result.rows.length === 0) throw new NotFoundException('Cliente não encontrado');
      return result.rows[0];
    } finally {
      await client.end();
    }
  }

  async findNfse(clientId: string, tenantId: string) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `SELECT id, numero_nfse, numero_rps, data_emissao, data_competencia,
                descricao_servico, valor_servico, valor_iss, valor_liquido,
                status, pago, forma_pagamento
         FROM nfse
         WHERE client_id = $1 AND tenant_id = $2
         ORDER BY data_emissao DESC`,
        [clientId, tenantId]
      );
      return result.rows;
    } finally {
      await client.end();
    }
  }

  async create(tenantId: string, dto: any) {
    const client = this.getClient();
    await client.connect();
    try {
      const result = await client.query(
        `INSERT INTO clients (
          tenant_id, cnpj, cpf, razao_social, nome_fantasia,
          inscricao_municipal, regime_tributario, email, telefone,
          logradouro, numero, complemento, bairro, cep, municipio, uf,
          aliquota_iss_especial, retencao_iss, retencao_inss, retencao_ir,
          retencao_csll, retencao_pis, retencao_cofins
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
        ) RETURNING *`,
        [
          tenantId,
          dto.cnpj, dto.cpf, dto.razaoSocial, dto.nomeFantasia,
          dto.inscricaoMunicipal, dto.regimeTributario, dto.email, dto.telefone,
          dto.logradouro, dto.numero, dto.complemento, dto.bairro,
          dto.cep, dto.municipio, dto.uf,
          dto.aliquotaIssEspecial,
          dto.retencaoIss || false, dto.retencaoInss || false,
          dto.retencaoIr || false, dto.retencaoCsll || false,
          dto.retencaoPis || false, dto.retencaoCofins || false,
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
        `UPDATE clients SET
          razao_social = COALESCE($3, razao_social),
          nome_fantasia = COALESCE($4, nome_fantasia),
          email = COALESCE($5, email),
          telefone = COALESCE($6, telefone),
          inscricao_municipal = COALESCE($7, inscricao_municipal),
          regime_tributario = COALESCE($8, regime_tributario),
          aliquota_iss_especial = COALESCE($9, aliquota_iss_especial),
          retencao_iss = COALESCE($10, retencao_iss),
          logradouro = COALESCE($11, logradouro),
          numero = COALESCE($12, numero),
          complemento = COALESCE($13, complemento),
          bairro = COALESCE($14, bairro),
          cep = COALESCE($15, cep),
          municipio = COALESCE($16, municipio),
          uf = COALESCE($17, uf),
          updated_at = NOW()
        WHERE id = $1 AND tenant_id = $2
        RETURNING *`,
        [
          id, tenantId,
          dto.razaoSocial, dto.nomeFantasia, dto.email, dto.telefone,
          dto.inscricaoMunicipal, dto.regimeTributario, dto.aliquotaIssEspecial,
          dto.retencaoIss, dto.logradouro, dto.numero, dto.complemento,
          dto.bairro, dto.cep, dto.municipio, dto.uf,
        ]
      );
      if (result.rows.length === 0) throw new NotFoundException('Cliente não encontrado');
      return result.rows[0];
    } finally {
      await client.end();
    }
  }
}