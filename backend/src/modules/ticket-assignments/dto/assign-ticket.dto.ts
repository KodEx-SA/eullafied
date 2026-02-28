import { IsUUID, IsOptional, IsString } from 'class-validator';

export class AssignTicketDto {
  @IsUUID()
  assignedToId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
