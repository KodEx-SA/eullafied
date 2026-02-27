<<<<<<< HEAD
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
=======
import { Injectable, NotFoundException } from '@nestjs/common';
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

<<<<<<< HEAD
  // Create a new department, ensuring uniqueness
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existingDept = await this.findByName(createDepartmentDto.name);
    if (existingDept) {
      throw new ConflictException(
        `Department with name "${createDepartmentDto.name}" already exists`,
      );
    }

=======
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

<<<<<<< HEAD
  // Get all active departments
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

<<<<<<< HEAD
  // Get department by ID
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
=======
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

<<<<<<< HEAD
  // Get department by name
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async findByName(name: string): Promise<Department | null> {
    return await this.departmentRepository.findOne({ where: { name } });
  }

<<<<<<< HEAD
  // Update department with uniqueness check
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);
<<<<<<< HEAD

    if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
      const existingDept = await this.findByName(updateDepartmentDto.name);
      if (existingDept) {
        throw new ConflictException(
          `Department with name "${updateDepartmentDto.name}" already exists`,
        );
      }
    }

=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
    Object.assign(department, updateDepartmentDto);
    return await this.departmentRepository.save(department);
  }

<<<<<<< HEAD
  // Hard delete
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }

<<<<<<< HEAD
  // Soft delete
=======
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
  async softDelete(id: string): Promise<Department> {
    const department = await this.findOne(id);
    department.isActive = false;
    return await this.departmentRepository.save(department);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> f3aaae32b41bdd6aa5febb38052d41b3dfc87c03
