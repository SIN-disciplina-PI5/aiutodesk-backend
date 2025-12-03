import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './infrastructure/database/database.module';

import { TenantsModule } from '@modules/tenants/tenants.module';
import { UsersModule } from '@modules/users/users.module';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, jwtConfig] }),
    CoreModule,
    DatabaseModule,

    // Domínios principais
    TenantsModule,
    UsersModule,
    TicketsModule,
    AuthModule,
  ],
})
export class AppModule {}
