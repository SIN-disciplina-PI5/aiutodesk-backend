import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard/dashboard.service';

@Module({
  providers: [DashboardService]
})
export class AnalyticsModule {}
