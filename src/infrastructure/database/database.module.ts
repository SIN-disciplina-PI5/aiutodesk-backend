import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '@config/database.config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig), 
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',

      ...(config.get<string>('database.url')
        ? { url: config.get<string>('database.url') }
        : {
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
        }),
      
      ssl: { rejectUnauthorized: false },

      autoLoadEntities: true,
      synchronize: config.get<boolean>('database.synchronize'),
      logging: config.get<boolean>('database.logging'),

      retryAttempts: 10,
      retryDelay: 3000,

      extra: {
        max: 1,
        keepAlive: true,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 5000,
      },
    }),
  }),
  ],
  
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
