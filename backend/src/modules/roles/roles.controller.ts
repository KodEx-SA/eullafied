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
import { RolesService } from './roles.service';
import * as dto from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Only admins can create roles
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createRoleDto: dto.CreateRoleDto): Promise<any> {
    return this.rolesService.create(createRoleDto);
  }

  // Any authenticated user can view all roles
  @Get()
  findAll(): Promise<any[]> {
    return this.rolesService.findAll();
  }

  // Any authenticated user can view a role
  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.rolesService.findOne(id);
  }

  // Only admins can update roles
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateRoleDto: dto.UpdateRoleDto): Promise<any> {
    return this.rolesService.update(id, updateRoleDto);
  }

  // Only admins can hard delete roles
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }

  // Only admins can soft delete roles
  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  softDelete(@Param('id') id: string): Promise<any> {
    return this.rolesService.softDelete(id);
  }
}