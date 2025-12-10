import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: jest.Mocked<DepartmentsService>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<DepartmentsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        {
          provide: DepartmentsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should parse comma separated include query and delegate to service', async () => {
    const expected = [{ id: '1', name: 'Dept' }];
    service.findAll.mockResolvedValue(expected as any);

    const result = await controller.findAll('tenant-1', 'users, articles ,');

    expect(service.findAll).toHaveBeenCalledWith('tenant-1', ['users', 'articles']);
    expect(result).toBe(expected);
  });

  it('should accept include array and delegate to service', async () => {
    const expected = [{ id: '1' }];
    service.findAll.mockResolvedValue(expected as any);

    const result = await controller.findAll('tenant-1', ['tenant', 'users']);

    expect(service.findAll).toHaveBeenCalledWith('tenant-1', ['tenant', 'users']);
    expect(result).toBe(expected);
  });

  it('should default include to empty array when omitted', async () => {
    service.findAll.mockResolvedValue([] as any);

    await controller.findAll('tenant-1', undefined as any);

    expect(service.findAll).toHaveBeenCalledWith('tenant-1', []);
  });

  it('should get department by id', async () => {
    const department = { id: 'uuid', name: 'Dept' } as any;
    service.findById.mockResolvedValue(department);

    const result = await controller.findById('uuid');

    expect(service.findById).toHaveBeenCalledWith('uuid');
    expect(result).toBe(department);
  });

  it('should create a department', async () => {
    const dto = { name: 'Dept', tenantId: 'tenant', costCenter: 123 } as any;
    const created = { id: 'uuid', ...dto } as any;
    service.create.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(created);
  });

  it('should update a department', async () => {
    const dto = { name: 'New Name' } as any;
    const updated = { id: 'uuid', ...dto } as any;
    service.update.mockResolvedValue(updated);

    const result = await controller.update('uuid', dto);

    expect(service.update).toHaveBeenCalledWith('uuid', dto);
    expect(result).toBe(updated);
  });

  it('should remove a department', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove('uuid');

    expect(service.remove).toHaveBeenCalledWith('uuid');
  });
});
