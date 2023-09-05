import {
  ExecutionContext,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from '../../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(@Inject(REQUEST) private readonly request: ExecutionContext) {}

  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    const jwtService: JwtService = new JwtService();
    const auth: AuthGuard = new AuthGuard(jwtService);
    const access = await auth.authorize(this.request);
    if (access != null) {
      return {
        dialect: 'postgres',
        host: access.primary_db.db_hostname,
        port: 5432,
        username: access.primary_db.db_username,
        password: access.primary_db.db_password,
        database: access.primary_db.db_name,
        autoLoadModels: true,
        synchronize: true,
      };
    }
    throw new UnauthorizedException();
  }
}
