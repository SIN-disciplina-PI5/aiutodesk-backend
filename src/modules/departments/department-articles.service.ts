import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentArticle } from './entities/department-article.entity';

@Injectable()
export class DepartmentArticlesService {
  constructor(
    @InjectRepository(DepartmentArticle)
    private repo: Repository<DepartmentArticle>,
  ) {}

  link(departmentId: string, articleId: string) {
    const link = this.repo.create({
      department: { id: departmentId },
      article: { id: articleId },
    });

    return this.repo.save(link);
  }

  findArticles(departmentId: string) {
    return this.repo.find({
      where: { department: { id: departmentId } },
      relations: ['article'],
    });
  }
}
