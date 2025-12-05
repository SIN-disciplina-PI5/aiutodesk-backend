import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Tenant } from '@modules/tenants/entities/tenant.entity';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(
    tenantId: string,
    include?: string[],
  ): Promise<Department[]> {
    if (!tenantId) {
      throw new NotFoundException('tenantId é obrigatório para buscar departamentos.');
    }

    const where: FindOptionsWhere<Department> = { tenant: { id: tenantId } };

    return this.departmentRepository.find({
      where,
      relations: include ?? [],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!department) {
      throw new NotFoundException(`Departamento com id ${id} não encontrado.`);
    }
    return department;
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: dto.tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    const department = this.departmentRepository.create({
      ...dto,
      tenant,
    });

    return await this.departmentRepository.save(department);
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findById(id);

    Object.assign(department, {
      ...(dto.name && { name: dto.name }),
      ...(dto.costCenter !== undefined && { costCenter: dto.costCenter }),
    });

    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findById(id);
    await this.departmentRepository.remove(department);
  }
}
