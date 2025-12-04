import { Module } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';
import { CategoriesModule } from './categories/categories.module'

@Module({
  imports: [CategoriesModule],
  providers: [ArticlesService],
  exports: [CategoriesModule],
})
export class KnowledgeModule {}
