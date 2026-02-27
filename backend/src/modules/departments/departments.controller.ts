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
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import * as dto from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  // Admin only
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createDepartmentDto: dto.CreateDepartmentDto): Promise<any> {
    return this.departmentsService.create(createDepartmentDto);
  }

  // Any authenticated user
  @Get()
  findAll(): Promise<any[]> {
    return this.departmentsService.findAll();
  }

  // Any authenticated user
  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.departmentsService.findOne(id);
  }

  // Admin only
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: dto.UpdateDepartmentDto,
  ): Promise<any> {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  // Admin only
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }

  // Admin only
  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  softDelete(@Param('id') id: string): Promise<any> {
    return this.departmentsService.softDelete(id);
  }
}