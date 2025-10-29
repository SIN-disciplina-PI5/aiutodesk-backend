import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '@config/database.config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get<string>('database.host'),
      port: config.get<number>('database.port'),
      username: config.get<string>('database.user'),
      password: config.get<string>('database.password'),
      database: config.get<string>('database.name'),
      synchronize: config.get<boolean>('database.synchronize'),
      logging: config.get<boolean>('database.logging'),
      autoLoadEntities: true,
    }),
    inject: [ConfigService],
  }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
