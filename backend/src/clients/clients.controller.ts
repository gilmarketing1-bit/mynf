import { Body, Controller, Get, Post, Put, Param, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.clientsService.findByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.clientsService.findOne(id, tenantId);
  }

  @Get(':id/nfse')
  findNfse(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.clientsService.findNfse(id, tenantId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.clientsService.create(tenantId, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() dto: any) {
    const tenantId = req.tenantId ?? 'dev-tenant';
    return this.clientsService.update(id, tenantId, dto);
  }
}