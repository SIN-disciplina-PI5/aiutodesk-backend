import { Module } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';
import { CategoriesService } from './categories/categories.service';

@Module({
  providers: [ArticlesService, CategoriesService]
})
export class KnowledgeModule {}
