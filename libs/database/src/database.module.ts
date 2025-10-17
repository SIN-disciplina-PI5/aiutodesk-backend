import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

require('dotenv').config();

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PWD'),
      database: configService.get<string>('DB_NAME'),
      entities: [],
      synchronize: (configService.get<string>('DB_SYNC') === 'true'),
      logging: true,
    }),
    inject: [ConfigService],
  }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }
