import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(dto: CreateArticleDto) {
    const article = this.articlesRepository.create(dto);
    return await this.articlesRepository.save(article);
  }

  async findAll() {
    return await this.articlesRepository.find();
  }

  async findOne(id: string) {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado');
    }

    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.findOne(id);

    const updated = Object.assign(article, dto);

    return await this.articlesRepository.save(updated);
  }

  async remove(id: string) {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);

    return { message: 'Artigo removido com sucesso' };
  }
}
