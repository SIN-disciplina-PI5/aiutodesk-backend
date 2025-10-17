import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule, DatabaseService } from '@database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { TicketsModule } from './tickets/tickets.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    TicketsModule,
    KnowledgeModule,
    WorkflowModule,
    AnalyticsModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit(): Promise<void> {
    const result = await this.databaseService.testQuery();
    console.log('Teste de conexão — Hora do servidor:', result.now);
  }

}
