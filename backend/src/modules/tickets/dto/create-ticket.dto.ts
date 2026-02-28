import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { TicketPriority } from '../../../shared/enums';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsUUID()
  departmentId: string;

  @IsString()
  @IsOptional()
  category?: string;
}
