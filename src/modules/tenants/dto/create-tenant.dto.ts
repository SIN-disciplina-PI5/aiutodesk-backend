import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TenantStatus } from "../entities/tenant.entity";

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    subdomain?: string;

    @IsOptional()
    @IsEnum(TenantStatus)
    status?: TenantStatus;

    @IsOptional()
    activation_date?: Date;

    @IsOptional()
    custom_settings?: Record<string, any>;
}
