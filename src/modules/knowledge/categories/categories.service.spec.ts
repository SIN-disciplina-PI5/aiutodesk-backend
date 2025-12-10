import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<Repository<Category>>;

  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Category',
    description: 'Test Description',
    tenantId: 'tenant-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Category;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get(getRepositoryToken(Category));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories for a tenant', async () => {
      const tenantId = 'tenant-123';
      const mockCategories = [mockCategory];
      repository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll(tenantId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { tenantId },
        relations: [],
      });
      expect(result).toEqual(mockCategories);
    });

    it('should return categories with specified relations', async () => {
      const tenantId = 'tenant-123';
      const relations = ['articles'];
      const mockCategories = [mockCategory];
      repository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll(tenantId, relations);

      expect(repository.find).toHaveBeenCalledWith({
        where: { tenantId },
        relations,
      });
      expect(result).toEqual(mockCategories);
    });
  });

  describe('findById', () => {
    it('should return a single category by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      repository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: [],
      });
      expect(result).toEqual(mockCategory);
    });

    it('should return a category with specified relations', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const relations = ['articles'];
      repository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findById(id, relations);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations,
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category is not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(id)).rejects.toThrow('Categoria não encontrada.');
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
        tenantId: 'tenant-123',
      } as any;

      repository.create.mockReturnValue(mockCategory);
      repository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockCategory);
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

      repository.findOne.mockResolvedValue(mockCategory);
      repository.save.mockResolvedValue(updatedCategory);

      const result = await service.update(id, updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: [],
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException when category to update is not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateCategoryDto = { name: 'Updated Category' };

      repository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      repository.findOne.mockResolvedValue(mockCategory);
      repository.remove.mockResolvedValue(mockCategory);

      const result = await service.remove(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: [],
      });
      expect(repository.remove).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual({ message: 'Categoria removida com sucesso.' });
    });

    it('should throw NotFoundException when category to remove is not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
