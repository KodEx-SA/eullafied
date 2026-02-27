import {
    Controller,
    Patch,
    Param,
    Body,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { TicketAssignmentsService } from './ticket-assignments.service';
  import { AssignTicketDto } from './dto/assign-ticket.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  
  @Controller('tickets')
  @UseGuards(JwtAuthGuard)
  export class TicketAssignmentsController {
    constructor(
      private readonly assignmentsService: TicketAssignmentsService,
    ) {}
  
    @Patch(':id/assign')
    @UseGuards(RolesGuard)
    @Roles('admin')
    assignTicket(
      @Param('id') id: string,
      @Body() dto: AssignTicketDto,
      @Req() req: any,
    ) {
      return this.assignmentsService.assignTicket(
        id,
        dto,
        req.user.id,
      );
    }
  }