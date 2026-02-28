import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateDepartmentDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  headOfDepartment?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
