import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { TicketsModule } from './tickets/tickets.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [UsersModule, AuthModule, TicketsModule, KnowledgeModule, WorkflowModule, AnalyticsModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
