import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { TicketPriority, TicketStatus } from '../../../shared/enums';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  resolutionNotes?: string;
}
