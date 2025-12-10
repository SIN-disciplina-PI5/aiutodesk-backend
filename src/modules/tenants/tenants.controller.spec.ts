import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';

describe('TenantsController', () => {
  let controller: TenantsController;
  let service: TenantsService;

  const mockTenant: Tenant = {
    id: 'tenant-id',
    name: 'Test Tenant',
    subdomain: 'test',
  } as Tenant;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tenants', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockTenant]);
      const result = await controller.findAll();
      expect(result).toEqual([mockTenant]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tenant', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTenant);
      const result = await controller.findOne('tenant-id');
      expect(result).toEqual(mockTenant);
      expect(service.findOne).toHaveBeenCalledWith('tenant-id');
    });
  });

  describe('create', () => {
    it('should create a tenant', async () => {
      const dto = { name: 'Test Tenant', subdomain: 'test' };
      jest.spyOn(service, 'create').mockResolvedValue(mockTenant);
      const result = await controller.create(dto as any);
      expect(result).toEqual(mockTenant);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const dto = { name: 'Updated' };
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockTenant, name: 'Updated' });
      const result = await controller.update('tenant-id', dto as any);
      expect(result.name).toBe('Updated');
      expect(service.update).toHaveBeenCalledWith('tenant-id', dto);
    });
  });

  describe('remove', () => {
    it('should delete a tenant', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await expect(controller.remove('tenant-id')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('tenant-id');
    });
  });
});
