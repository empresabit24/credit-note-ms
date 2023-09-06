import { Module } from '@nestjs/common';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import { ApplicationCoreModule } from './application-core/application-core.module';
import { InfraestructureModule } from './infraestructure/infraestructure.module';

@Module({
  imports: [InfraestructureModule, ApplicationCoreModule, UserInterfaceModule],
})
export class AppModule {}
