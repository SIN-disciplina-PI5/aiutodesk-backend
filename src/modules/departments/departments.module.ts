import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { Tenant } from '@modules/tenants/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Tenant])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
