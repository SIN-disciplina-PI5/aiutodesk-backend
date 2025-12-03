import { Module } from '@nestjs/common';
import { ArticlesService } from './articles/articles.service';
import { CategoriesService } from './categories/categories.service';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [ArticlesModule],
  providers: [ArticlesService, CategoriesService],
})

export class KnowledgeModule {}
