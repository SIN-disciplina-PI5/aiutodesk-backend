import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // GET /users
    @Get()
    async findAll(
        @Query('role') role?: string,
        @Query('include') include?: string,
    ): Promise<User[]> {
        const relations = include ? include.split(',') : undefined;
        return this.usersService.findAll(role, relations);
    }

    // GET /users/email/:email
    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<User | null> {
        return this.usersService.findByEmail(email);
    }

    // GET /users/:id
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findById(id);
    }

    // POST /users
    @Post()
    async create(@Body() userData: Partial<User>): Promise<User> {
        return this.usersService.create(userData);
    }

    // PATCH /users/:id
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<User>,
    ): Promise<User> {
        return this.usersService.update(id, updateData);
    }

    // PATCH /users/:id/password
    @Patch(':id/password')
    async changePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body('password') password: string,
    ): Promise<User> {
        if (!password) throw new NotFoundException('Senha não informada.');
        return this.usersService.changePassword(id, password);
    }

    // DELETE /users/:id
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.usersService.delete(id);
        return { message: `Usuário ${id} removido com sucesso.` };
    }
}
