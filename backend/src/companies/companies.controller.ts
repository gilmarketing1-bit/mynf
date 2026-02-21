import { Body, Controller, Get, Post, Put, Param, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  list(@Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.companiesService.findByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.companiesService.findOne(id, tenantId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.companiesService.create(tenantId, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.companiesService.update(id, tenantId, dto);
  }
}