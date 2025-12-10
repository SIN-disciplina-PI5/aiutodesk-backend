import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: jest.Mocked<ArticlesService>;

  const mockArticle = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Article',
    content: 'Test Content',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockArticlesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get(ArticlesService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test Content',
      } as CreateArticleDto;

      service.create.mockResolvedValue(mockArticle);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockArticle);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const mockArticles = [mockArticle];
      service.findAll.mockResolvedValue(mockArticles);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });

    it('should return an empty array when no articles exist', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single article by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      service.findOne.mockResolvedValue(mockArticle);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockArticle);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateArticleDto = {
        title: 'Updated Title',
      };
      const updatedArticle = { ...mockArticle, ...updateDto };

      service.update.mockResolvedValue(updatedArticle);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedArticle);
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const removeResponse = { message: 'Artigo removido com sucesso' };

      service.remove.mockResolvedValue(removeResponse);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removeResponse);
    });
  });
});
