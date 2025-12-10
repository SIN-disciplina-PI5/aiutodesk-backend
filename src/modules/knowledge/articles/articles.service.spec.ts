import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: jest.Mocked<Repository<Article>>;

  const mockArticle = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Article',
    content: 'Test Content',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

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
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get(getRepositoryToken(Article));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test Content',
      } as CreateArticleDto;

      repository.create.mockReturnValue(mockArticle);
      repository.save.mockResolvedValue(mockArticle);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockArticle);
      expect(result).toEqual(mockArticle);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const mockArticles = [mockArticle];
      repository.find.mockResolvedValue(mockArticles);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });

    it('should return an empty array when no articles exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single article by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      repository.findOne.mockResolvedValue(mockArticle);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article is not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow('Artigo não encontrado');
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateArticleDto = {
        title: 'Updated Title',
      };
      const updatedArticle = { ...mockArticle, ...updateDto };

      repository.findOne.mockResolvedValue(mockArticle);
      repository.save.mockResolvedValue(updatedArticle);

      const result = await service.update(id, updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedArticle);
    });

    it('should throw NotFoundException when article to update is not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateArticleDto = { title: 'Updated Title' };

      repository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      repository.findOne.mockResolvedValue(mockArticle);
      repository.remove.mockResolvedValue(mockArticle);

      const result = await service.remove(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.remove).toHaveBeenCalledWith(mockArticle);
      expect(result).toEqual({ message: 'Artigo removido com sucesso' });
    });

    it('should throw NotFoundException when article to remove is not found', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
