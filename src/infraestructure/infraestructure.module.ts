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
import { ParameterService } from './persistence/services/parameter.service';
import { Parameter } from './persistence/models/parameter.model';
import { ProductLocalService } from './persistence/services/product-local.service';
import { ProductLocal } from './persistence/models/product-local.model';
import { StockProductLocalService } from './persistence/services/stock-product-local.service';
import { StockProductLocal } from './persistence/models/stock-product-local.model';
import { StoreService } from './persistence/services/store.service';
import { Store } from './persistence/models/store.model';
import { DocumentoVentaService } from "./persistence/services/documento-venta.service";
import {DocumentosVentaModel} from "./persistence/models/documentosventa.model";

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
    SequelizeModule.forFeature([
      CreditNote,
      DocumentosVentaModel,
      FeProviderNubefactLocal,
      Parameter,
      ProductLocal,
      StockProductLocal,
      Store,
    ]),
  ],
  providers: [
    CreditNoteService,
    DocumentoVentaService,
    FeProviderNubefactLocalService,
    ParameterService,
    ProductLocalService,
    StockProductLocalService,
    StoreService,
    NubefactClient,
  ],
  exports: [
    CreditNoteService,
    DocumentoVentaService,
    FeProviderNubefactLocalService,
    ParameterService,
    ProductLocalService,
    StockProductLocalService,
    StoreService,
    NubefactClient,
  ],
})
export class InfraestructureModule {}
