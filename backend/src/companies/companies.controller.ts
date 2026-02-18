import { Body, Controller, Get, Post, Req } from '@nestjs/common';

interface CompanyDto {
  cnpj: string;
  razaoSocial: string;
}

@Controller('companies')
export class CompaniesController {
  private readonly data: Array<CompanyDto & { tenantId: string }> = [];

  @Get()
  list(@Req() req: { tenantId?: string }): CompanyDto[] {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.data.filter((item) => item.tenantId === tenantId).map(({ tenantId: _tenantId, ...company }) => company);
  }

  @Post()
  create(@Req() req: { tenantId?: string }, @Body() payload: CompanyDto): CompanyDto {
    const tenantId = req.tenantId ?? 'dev-tenant';
    this.data.push({ ...payload, tenantId });
    return payload;
  }
}
