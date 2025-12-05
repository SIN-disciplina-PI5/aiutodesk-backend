import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserDepartmentsService } from './user-departments.service';

@Controller('users/:userId/departments')
export class UserDepartmentsController {
  constructor(private service: UserDepartmentsService) {}

  @Post(':departmentId')
  link(
    @Param('userId') userId: string,
    @Param('departmentId') departmentId: string,
  ) {
    return this.service.link(userId, departmentId);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.service.findDepartments(userId);
  }
}
