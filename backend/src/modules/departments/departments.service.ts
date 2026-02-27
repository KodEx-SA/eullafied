import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  // Create a new department, ensuring uniqueness
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existingDept = await this.findByName(createDepartmentDto.name);
    if (existingDept) {
      throw new ConflictException(
        `Department with name "${createDepartmentDto.name}" already exists`,
      );
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  // Get all active departments
  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  // Get department by ID
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  // Get department by name
  async findByName(name: string): Promise<Department | null> {
    return await this.departmentRepository.findOne({ where: { name } });
  }

  // Update department with uniqueness check
  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
      const existingDept = await this.findByName(updateDepartmentDto.name);
      if (existingDept) {
        throw new ConflictException(
          `Department with name "${updateDepartmentDto.name}" already exists`,
        );
      }
    }

    Object.assign(department, updateDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  // Hard delete
  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }

  // Soft delete
  async softDelete(id: string): Promise<Department> {
    const department = await this.findOne(id);
    department.isActive = false;
    return await this.departmentRepository.save(department);
  }
}