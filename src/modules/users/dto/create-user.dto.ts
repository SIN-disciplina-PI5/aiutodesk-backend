import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { UserRole } from "@shared/user-role.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: 'E-mail é obrigatório.' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    password: string;

    @IsString({ message: 'Role inválida.' })
    @IsOptional()
    role?: string;

    @IsUUID()
    @IsNotEmpty({ message: 'Tenant ID é obrigatório.' })
    tenantId: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
