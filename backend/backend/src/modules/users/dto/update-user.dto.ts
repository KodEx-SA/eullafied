import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { UserStatus } from '../../../shared/enums';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  lastName?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsUUID()
  @IsOptional()
  roleId?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
