import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @MaxLength(100)
  name: string;

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
