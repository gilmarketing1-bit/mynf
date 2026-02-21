import { Body, Controller, Get, Post, Param, Req, Query } from '@nestjs/common';
import { NfseService } from './nfse.service';

@Controller('nfse')
export class NfseController {
  constructor(private readonly nfseService: NfseService) {}

  @Get('dashboard')
  dashboard(@Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.nfseService.dashboard(tenantId);
  }

  @Get()
  list(@Req() req: any, @Query() query: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.nfseService.findByTenant(tenantId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.nfseService.findOne(id, tenantId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.nfseService.create(tenantId, dto);
  }
}