import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
