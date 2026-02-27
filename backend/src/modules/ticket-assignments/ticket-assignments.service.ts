import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, IsNull } from 'typeorm';
  import { TicketAssignment } from './entities/ticket-assignment.entity';
  import { TicketsService } from '../tickets/tickets.service';
  import { UsersService } from '../users/users.service';
  import { AssignTicketDto } from './dto/assign-ticket.dto';
  import { TicketStatus } from '../tickets/entities/ticket.entity';
  
  @Injectable()
  export class TicketAssignmentsService {
    constructor(
      @InjectRepository(TicketAssignment)
      private readonly assignmentRepository: Repository<TicketAssignment>,
      private readonly ticketsService: TicketsService,
      private readonly usersService: UsersService,
    ) {}
  
    async assignTicket(
      ticketId: string,
      dto: AssignTicketDto,
      assignedById: string,
    ): Promise<TicketAssignment> {
      const ticket = await this.ticketsService.findOne(ticketId);
  
      if (ticket.status === TicketStatus.CLOSED) {
        throw new BadRequestException('Cannot assign a closed ticket');
      }
  
      const assignedTo = await this.usersService.findOne(dto.assignedToId);
      const assignedBy = await this.usersService.findOne(assignedById);
  
      // Close previous active assignment
      const activeAssignment = await this.assignmentRepository.findOne({
        where: {
          ticket: { id: ticketId },
          unassignedAt: IsNull(),
        },
      });
  
      if (activeAssignment) {
        activeAssignment.unassignedAt = new Date();
        await this.assignmentRepository.save(activeAssignment);
      }
  
      const assignment = this.assignmentRepository.create({
        ticket,
        assignedTo,
        assignedBy,
        notes: dto.notes,
      });
  
      // Automatically move ticket to IN_PROGRESS
      ticket.status = TicketStatus.IN_PROGRESS;
      await this.ticketsService.update(ticket.id, {
        status: TicketStatus.IN_PROGRESS,
      });
  
      return await this.assignmentRepository.save(assignment);
    }
  }