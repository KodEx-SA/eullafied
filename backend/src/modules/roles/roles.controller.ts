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
<<<<<<< HEAD
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
=======
} from '@nestjs/common';
import { RolesService } from './roles.service';
import * as dto from './dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoleDto: dto.CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: dto.UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Patch(':id/deactivate')
  softDelete(@Param('id') id: string) {
    return this.rolesService.softDelete(id);
  }
}
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
