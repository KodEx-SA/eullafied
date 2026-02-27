import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { TicketsService } from './tickets.service';
  import { CreateTicketDto } from './dto/create-ticket.dto';
  import { UpdateTicketDto } from './dto/update-ticket.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  
  @Controller('tickets')
  @UseGuards(JwtAuthGuard)
  export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateTicketDto, @Req() req: any) {
      return this.ticketsService.create(dto, req.user.id);
    }
  
    @Get()
    findAll() {
      return this.ticketsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.ticketsService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
      return this.ticketsService.update(id, dto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles('admin')
    remove(@Param('id') id: string) {
      return this.ticketsService.remove(id);
    }
  
    @Patch(':id/deactivate')
    @UseGuards(RolesGuard)
    @Roles('admin')
    softDelete(@Param('id') id: string) {
      return this.ticketsService.softDelete(id);
    }
  }