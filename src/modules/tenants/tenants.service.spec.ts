import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { NotFoundException } from '@nestjs/common';

describe('TenantsService', () => {
  let service: TenantsService;
  let repo: any;

  const mockTenant: Tenant = {
    id: 'tenant-id',
    name: 'Test Tenant',
    subdomain: 'test',
  } as Tenant;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    repo = module.get(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a tenant', async () => {
      repo.create.mockReturnValue(mockTenant);
      repo.save.mockResolvedValue(mockTenant);
      const dto = { name: 'Test Tenant', subdomain: 'test' };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockTenant);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tenants', async () => {
      repo.find.mockResolvedValue([mockTenant]);
      const result = await service.findAll();
      expect(result).toEqual([mockTenant]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tenant', async () => {
      repo.findOne.mockResolvedValue(mockTenant);
      const result = await service.findOne('tenant-id');
      expect(result).toEqual(mockTenant);
    });

    it('should throw NotFoundException when tenant not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('tenant-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTenant);
      repo.save.mockResolvedValue({ ...mockTenant, name: 'Updated' });
      const result = await service.update('tenant-id', { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete tenant', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTenant);
      repo.remove.mockResolvedValue(undefined);
      await expect(service.remove('tenant-id')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when tenant not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('tenant-id')).rejects.toThrow(NotFoundException);
    });
  });
});
