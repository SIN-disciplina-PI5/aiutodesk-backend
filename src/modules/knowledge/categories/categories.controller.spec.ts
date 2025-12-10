import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: jest.Mocked<CategoriesService>;

  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Category',
    description: 'Test Description',
    tenantId: 'tenant-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategoriesService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const tenantId = 'tenant-123';
      const mockCategories = [mockCategory];
      service.findAll.mockResolvedValue(mockCategories);

      const result = await controller.findAll(tenantId);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, []);
      expect(result).toEqual(mockCategories);
    });

    it('should return categories with relations when include is a string', async () => {
      const tenantId = 'tenant-123';
      const include = 'tenant,articles';
      const mockCategories = [mockCategory];
      service.findAll.mockResolvedValue(mockCategories);

      const result = await controller.findAll(tenantId, include);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, ['tenant', 'articles']);
      expect(result).toEqual(mockCategories);
    });

    it('should return categories with relations when include is an array', async () => {
      const tenantId = 'tenant-123';
      const include = ['tenant', 'articles'];
      const mockCategories = [mockCategory];
      service.findAll.mockResolvedValue(mockCategories);

      const result = await controller.findAll(tenantId, include);

      expect(service.findAll).toHaveBeenCalledWith(tenantId, include);
      expect(result).toEqual(mockCategories);
    });
  });

  describe('findById', () => {
    it('should return a single category by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      service.findById.mockResolvedValue(mockCategory);

      const result = await controller.findById(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
        tenantId: 'tenant-123',
      } as any;

      service.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      const updatedCategory = { ...mockCategory, ...updateDto };

      service.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const removeResponse = { message: 'Categoria removida com sucesso.' };

      service.remove.mockResolvedValue(removeResponse);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResponse);
    });
  });
});
