import { Module } from '@nestjs/common';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import { ApplicationCoreModule } from './application-core/application-core.module';
import { InfraestructureModule } from './infraestructure/infraestructure.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        useUTC: false,
      },
      timezone: '+00:00',
    }),
    UserInterfaceModule,
    ApplicationCoreModule,
    InfraestructureModule,
  ],
})
export class AppModule {}
