import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Ticket } from './entities/ticket.entity';
  import { CreateTicketDto } from './dto/create-ticket.dto';
  import { UpdateTicketDto } from './dto/update-ticket.dto';
  import { UsersService } from '../users/users.service';
  import { DepartmentsService } from '../departments/departments.service';
  
  @Injectable()
  export class TicketsService {
    constructor(
      @InjectRepository(Ticket)
      private readonly ticketRepository: Repository<Ticket>,
      private readonly usersService: UsersService,
      private readonly departmentsService: DepartmentsService,
    ) {}
  
    async create(
      createTicketDto: CreateTicketDto,
      userId: string,
    ): Promise<Ticket> {
      const user = await this.usersService.findOne(userId);
      const department = await this.departmentsService.findOne(
        createTicketDto.departmentId,
      );
  
      const ticket = this.ticketRepository.create({
        title: createTicketDto.title,
        description: createTicketDto.description,
        priority: createTicketDto.priority,
        createdBy: user,
        department,
      });
  
      return await this.ticketRepository.save(ticket);
    }
  
    async findAll(): Promise<Ticket[]> {
      return await this.ticketRepository.find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
    }
  
    async findOne(id: string): Promise<Ticket> {
      const ticket = await this.ticketRepository.findOne({
        where: { id },
      });
  
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }
  
      return ticket;
    }
  
    async update(
      id: string,
      updateTicketDto: UpdateTicketDto,
    ): Promise<Ticket> {
      const ticket = await this.findOne(id);
  
      Object.assign(ticket, updateTicketDto);
  
      return await this.ticketRepository.save(ticket);
    }
  
    async remove(id: string): Promise<void> {
      const ticket = await this.findOne(id);
      await this.ticketRepository.remove(ticket);
    }
  
    async softDelete(id: string): Promise<Ticket> {
      const ticket = await this.findOne(id);
      ticket.isActive = false;
      return await this.ticketRepository.save(ticket);
    }
  }