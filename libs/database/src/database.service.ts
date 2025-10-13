import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL não está definida no .env');
    }

    this.client = new Client({ connectionString });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Conexão com PostgreSQL estabelecida com sucesso!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Falha ao conectar ao PostgreSQL:', err.message);
      } else {
        console.error('Falha desconhecida ao conectar ao PostgreSQL:', err);
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.end();
    console.log('Conexão com PostgreSQL encerrada.');
  }

  async testQuery(): Promise<{ now: string }> {
    const result = await this.client.query('SELECT NOW() as now');
    return result.rows[0];
  }
}
