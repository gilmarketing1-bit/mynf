import { Module } from '@nestjs/common';
import { NfseController } from './nfse.controller';
import { NfseService } from './nfse.service';

@Module({
  controllers: [NfseController],
  providers: [NfseService],
  exports: [NfseService],
})
export class NfseModule {}