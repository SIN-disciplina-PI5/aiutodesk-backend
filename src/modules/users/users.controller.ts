import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll(
  @Query('tenantId') tenantId: string,
  @Query('role') role?: string,
  @Query('include') include?: string | string[],
  ) {
    const relations: string[] =
      typeof include === 'string'
      ? include.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(include)
      ? include
      : [];

    return this.usersService.findAll(tenantId, role, relations);
  }

  // GET /users/email/:email
  @Get('email/:email')
  findByEmail(
  @Param('email') email: string,
  @Query('tenantId') tenantId?: string,
  ) {
    return this.usersService.findByEmail(email, tenantId);
  }

  // GET /users/:id
  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findById(id);
  }

  // POST /users
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.save(dto);
  }

  // PATCH /users/:id
  @Patch(':id')
  update(
  @Param('id', new ParseUUIDPipe()) id: string,
  @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // PATCH /users/:id/password
  @Patch(':id/password')
  changePassword(
  @Param('id', new ParseUUIDPipe()) id: string,
  @Body('password') password: string,
  ) {
    if (!password) throw new BadRequestException('Senha não informada.');
    return this.usersService.changePassword(id, password);
  }

  // DELETE /users/:id
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.remove(id);
  }
}
