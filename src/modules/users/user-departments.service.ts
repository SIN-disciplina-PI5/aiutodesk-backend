import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDepartment } from './entities/user-department.entity';

@Injectable()
export class UserDepartmentsService {
  constructor(
    @InjectRepository(UserDepartment)
    private repo: Repository<UserDepartment>,
  ) {}

  link(userId: string, departmentId: string) {
    const link = this.repo.create({
      user: { id: userId },
      department: { id: departmentId },
    });

    return this.repo.save(link);
  }

  findDepartments(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['department'],
    });
  }
}
