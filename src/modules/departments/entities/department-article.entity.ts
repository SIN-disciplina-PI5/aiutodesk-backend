import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Department } from './department.entity';
import { Article } from '../../knowledge/articles/entities/article.entity';

@Entity('department_articles')
export class DepartmentArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Department)
  department: Department;

  @ManyToOne(() => Article)
  article: Article;
}
