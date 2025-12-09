import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '@modules/tenants/entities/tenant.entity';
import { asyncWrapProviders } from 'async_hooks';
import { NotFoundException } from '@nestjs/common';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repo: jest.Mocked<Repository<Department>>;
  let tenantRepo: any;

  const mockDepartment: Department = {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Financeiro',
    costCenter: '0010',
  } as Department;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repo = module.get(getRepositoryToken(Department));
    tenantRepo = module.get(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all departments', async () => {
      repo.find.mockResolvedValue([mockDepartment]);
      const result = await service.findAll('tenant-id');
      expect(result).toEqual([mockDepartment]);
      expect(repo.find).toHaveBeenCalled();
      return result;
    });
  });

  describe('findById', () => {
    it('Should return a department', async () => {
      repo.findOne.mockResolvedValue(mockDepartment);
      const result = await service.findById('id');
      expect(result).toEqual(mockDepartment);
    });

    it('Should throw NotFoundException when department not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findById('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('Should create and save a department', async () => {
      const mockTenant = { id: 'tenant-id' } as any;
      const mockSavedDepartment = { ...mockDepartment, tenant: mockTenant } as any;
      tenantRepo.findOne.mockResolvedValue(mockTenant);
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockSavedDepartment);
      repo.save.mockResolvedValue(mockSavedDepartment);
      const dto: any = { ...mockDepartment, tenantId: 'tenant-id' };
      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('Should update a department', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockDepartment);
      repo.save.mockResolvedValue({ ...mockDepartment, name: 'Updated' });
      const result = await service.update('it', { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockDepartment);
      repo.remove.mockResolvedValue(undefined as any);
      await expect(service.remove('id')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
