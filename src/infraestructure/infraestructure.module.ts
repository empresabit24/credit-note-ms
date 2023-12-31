import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreditNote } from './persistence/models/credit-note.model';
import { CreditNoteService } from './persistence/services/credit-note.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeConfigService } from './persistence/services/sequelize-config.service';
import { FeProviderNubefactLocalService } from './persistence/services/fe-provider-nubefact-local.service';
import { FeProviderNubefactLocal } from './persistence/models/provider-nubefact-local.model';
import { NubefactClient } from './microservice-clients/http/nubefact.client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60s' },
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: SequelizeConfigService,
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
