import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { CompaniesModule } from './companies/companies.module';
import { ClientsModule } from './clients/clients.module';
import { NfseModule } from './nfse/nfse.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 60000, limit: 100 },
      { name: 'strict', ttl: 60000, limit: 10 },
    ]),
    TenantModule,
    AuthModule,
    CompaniesModule,
    ClientsModule,
    NfseModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}