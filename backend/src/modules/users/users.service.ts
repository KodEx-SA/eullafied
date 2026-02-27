/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
<<<<<<< HEAD
  BadRequestException,
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';
import { DepartmentsService } from '../departments/departments.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Verify role exists
    const role = await this.rolesService.findOne(createUserDto.roleId);
<<<<<<< HEAD
    if (!role) {
      throw new NotFoundException(`Role with ID ${createUserDto.roleId} not found`);
    }

    // Verify department exists
    const department = await this.departmentsService.findOne(createUserDto.departmentId);
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${createUserDto.departmentId} not found`,
      );
    }
=======

    // Verify department exists
    const department = await this.departmentsService.findOne(
      createUserDto.departmentId,
    );
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
      department,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
<<<<<<< HEAD
      relations: ['role', 'department'], // eager load related entities
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
<<<<<<< HEAD
      relations: ['role', 'department'],
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
<<<<<<< HEAD
      relations: ['role', 'department'],
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If updating email, check for conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // If updating role, verify it exists
    if (updateUserDto.roleId) {
      const role = await this.rolesService.findOne(updateUserDto.roleId);
<<<<<<< HEAD
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.roleId} not found`);
      }
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
      user.role = role;
    }

    // If updating department, verify it exists
    if (updateUserDto.departmentId) {
<<<<<<< HEAD
      const department = await this.departmentsService.findOne(updateUserDto.departmentId);
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${updateUserDto.departmentId} not found`,
        );
      }
=======
      const department = await this.departmentsService.findOne(
        updateUserDto.departmentId,
      );
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
      user.department = department;
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

<<<<<<< HEAD
  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
=======
  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    const user = await this.findOne(userId);
    if (refreshToken) {
      user.refreshToken = await bcrypt.hash(refreshToken, 10);
    } else {
<<<<<<< HEAD
=======
      // @ts-ignore - TypeORM handles nullable columns correctly
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
      user.refreshToken = null;
    }
    await this.userRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    const user = await this.findOne(userId);
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
