<<<<<<< HEAD
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
=======
import { Injectable, NotFoundException } from '@nestjs/common';
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

<<<<<<< HEAD
  // Create a new role, ensuring uniqueness
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.findByName(createRoleDto.name);
    if (existingRole) {
      throw new ConflictException(`Role with name "${createRoleDto.name}" already exists`);
    }

=======
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

<<<<<<< HEAD
  // Get all active roles
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

<<<<<<< HEAD
  // Get role by ID
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

<<<<<<< HEAD
  // Get role by name
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async findByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { name } });
  }

<<<<<<< HEAD
  // Update role, ensuring name uniqueness
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.findByName(updateRoleDto.name);
      if (existingRole) {
        throw new ConflictException(`Role with name "${updateRoleDto.name}" already exists`);
      }
    }

=======
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

<<<<<<< HEAD
  // Hard delete role
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

<<<<<<< HEAD
  // Soft delete role (mark inactive)
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async softDelete(id: string): Promise<Role> {
    const role = await this.findOne(id);
    role.isActive = false;
    return await this.roleRepository.save(role);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
