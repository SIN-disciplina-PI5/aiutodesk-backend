import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  // GET /categories
  findAll(tenantId: string, relations: string[] = []) {
    return this.repo.find({
      where: { tenantId },
      relations,
    });
  }

  // GET /categories/:id
  async findById(id: string, relations: string[] = []) {
    const category = await this.repo.findOne({
      where: { id },
      relations,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  // POST /categories
  create(dto: CreateCategoryDto) {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  // PATCH /categories/:id
  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findById(id);
    Object.assign(category, dto);
    return this.repo.save(category);
  }

  // DELETE /categories/:id
  async remove(id: string) {
    const category = await this.findById(id);
    await this.repo.remove(category);
    return { message: 'Categoria removida com sucesso.' };
  }
}
