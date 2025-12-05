import { Controller, Get, Param, Post } from '@nestjs/common';
import { DepartmentArticlesService } from './department-articles.service';

@Controller('departments/:departmentId/articles')
export class DepartmentArticlesController {
  constructor(private service: DepartmentArticlesService) {}

  @Post(':articleId')
  link(
    @Param('departmentId') departmentId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.service.link(departmentId, articleId);
  }

  @Get()
  findAll(@Param('departmentId') departmentId: string) {
    return this.service.findArticles(departmentId);
  }
}
