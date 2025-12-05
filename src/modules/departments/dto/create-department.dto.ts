import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsString()
  @IsOptional()
  costCenter?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Tenant ID é obrigatório.' })
  tenantId: string;
}
