import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
