import { Module } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module'

@Module({
  imports: [CategoriesModule],
  providers: [ArticlesService, CategoriesService],
})
export class KnowledgeModule {}
