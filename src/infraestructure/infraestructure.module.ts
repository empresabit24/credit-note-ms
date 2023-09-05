import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreditNote } from './persistence/models/credit-note.model';
import { CreditNoteService } from './persistence/services/credit-note.service';
import { HttpModule } from '@nestjs/axios';
import { FeProviderNubefactLocalService } from './persistence/services/fe-provider-nubefact-local.service';
import { FeProviderNubefactLocal } from './persistence/models/provider-nubefact-local.model';
import { NubefactClient } from './microservice-clients/http/nubefact.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
      }),
    }),
    SequelizeModule.forFeature([CreditNote, FeProviderNubefactLocal]),
  ],
  providers: [
    CreditNoteService,
    FeProviderNubefactLocalService,
    NubefactClient,
  ],
  exports: [CreditNoteService, FeProviderNubefactLocalService, NubefactClient],
})
export class InfraestructureModule {}
