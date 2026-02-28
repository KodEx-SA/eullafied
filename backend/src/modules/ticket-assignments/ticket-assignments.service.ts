import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketAssignment } from './entities/ticket-assignment.entity';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from '../users/users.service';
import { TicketStatus } from '../../shared/enums';

@Injectable()
export class TicketAssignmentsService {
  constructor(
    @InjectRepository(TicketAssignment)
    private readonly assignmentRepository: Repository<TicketAssignment>,
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  async assign(ticketId: string, dto: AssignTicketDto, assignedById: string): Promise<TicketAssignment> {
    const ticket     = await this.ticketsService.findOne(ticketId);
    const assignedTo = await this.usersService.findOne(dto.assignedToId);
    const assignedBy = await this.usersService.findOne(assignedById);

    await this.ticketsService.update(ticketId, { status: TicketStatus.IN_PROGRESS });

    const assignment = this.assignmentRepository.create({
      ticket,
      assignedTo,
      assignedBy,
      notes: dto.notes,
      assignedAt: new Date(),
    });

    return await this.assignmentRepository.save(assignment);
  }

  async findByTicket(ticketId: string): Promise<TicketAssignment[]> {
    return await this.assignmentRepository.find({
      where: { ticket: { id: ticketId } },
      order: { assignedAt: 'DESC' },
    });
  }
}
