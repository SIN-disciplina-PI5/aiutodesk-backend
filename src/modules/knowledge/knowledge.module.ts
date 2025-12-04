import { Module } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';
import { CategoriesService } from './categories/categories.service';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [ArticlesModule],
  providers: [CategoriesService],
  exports: [ArticlesModule],
})

export class KnowledgeModule {}
