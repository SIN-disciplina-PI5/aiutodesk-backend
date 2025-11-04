import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Tenant } from '@modules/tenants/entities/tenant.entity';
import { User } from '@modules/users/entities/user.entity';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) { }

  findAll(
    tenantId: string, role?: string, include?: string[]): Promise<User[]> {
    if (!tenantId) {
      throw new NotFoundException('tenantId é obrigatório para buscar usuários.');
    }

    const where: FindOptionsWhere<User> = { tenant: { id: tenantId } };

    if (role) where.role = role;

    return this.userRepository.find({
      where,
      relations: include ?? [],
      order: { id: 'ASC' },
    });
  }

  getByRole(role: string, tenantId: string) {
    return this.userRepository.find({
      where: { role, tenant: { id: tenantId } },
      order: { id: 'ASC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!user) throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    return user;
  }

  async findByEmail(email: string, tenantId?: string): Promise<User | null> {
    const where: FindOptionsWhere<User> = tenantId
      ? { email, tenant: { id: tenantId } }
      : { email };

    return this.userRepository.findOne({ where, relations: ['tenant'] });
  }

  async save(dto: CreateUserDto) {
    const tenant = await this.tenantRepository.findOne({ where: { id: dto.tenantId } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    const existing = await this.userRepository.findOne({
      where: { email: dto.email, tenant: { id: tenant.id } },
    });
    if (existing) throw new ConflictException('E-mail já está em uso');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      isActive: dto.isActive ?? true,
      tenant,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      isActive: savedUser.isActive,
      tenantId: savedUser.tenant.id,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    Object.assign(user, {
      ...(dto.name && { name: dto.name }),
      ...(dto.role && { role: dto.role }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });

    return this.userRepository.save(user);
  }

  async changePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.findById(id);
    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
