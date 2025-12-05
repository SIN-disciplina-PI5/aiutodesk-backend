import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    const connectionString =
      this.configService.get<string>('database.url') ||
      this.buildConnectionString();

    if (!connectionString) {
      throw new Error('DB_URL não está definida no .env');
    }

    this.client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }

  private buildConnectionString(): string | null {
    const host = this.configService.get<string>('database.host');
    const port = this.configService.get<number>('database.port');
    const user = this.configService.get<string>('database.user');
    const password = this.configService.get<string>('database.password');
    const name = this.configService.get<string>('database.name');

    return `postgresql://${user}:${password}@${host}:${port}/${name}?sslmode=require`;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log('Conexão com PostgreSQL estabelecida com sucesso!');

      const { now } = await this.testQuery();
      this.logger.log(`Teste de consulta bem-sucedido: ${now}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Falha ao conectar ao PostgreSQL:', error.message);
      } else {
        this.logger.error('Falha desconhecida ao conectar ao PostgreSQL:', error);
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.end();
    this.logger.log('Conexão com PostgreSQL encerrada.');
  }

  async testQuery(): Promise<{ now: string }> {
    const result = await this.client.query('SELECT NOW() as now');
    return result.rows[0];
  }
}
