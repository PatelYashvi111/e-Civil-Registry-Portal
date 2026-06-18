import { Injectable, BadRequestException,NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepository } from './department.repository';

@Injectable()
export class DepartmentService {
 
    constructor(
      private readonly departmentRepository: DepartmentRepository, 
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const existingDepartment = await this.departmentRepository.findByName(createDepartmentDto.name.trim().toLowerCase());
    
    if (existingDepartment) {
      throw new BadRequestException('Department already exists');
    }
   return await this.departmentRepository.create(createDepartmentDto);
  }

  async findAll() {
    return await this.departmentRepository.findAll();
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findById(id);

    if(!department) {
      throw new NotFoundException('Department not found');
    }
    
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.findById(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    if (updateDepartmentDto.name) {
      const existingDepartment = await this.departmentRepository.findByName(updateDepartmentDto.name.trim().toLowerCase());

      if (existingDepartment && existingDepartment.id !== id) {
        throw new BadRequestException('Department already exists');
      }
    }

    return await this.departmentRepository.update(id, updateDepartmentDto);
  }

  async delete(id: string) {
  const department = await this.departmentRepository.findById(id);

  if (!department) {
    throw new NotFoundException('Department not found');
  }

  return await this.departmentRepository.delete(id);
 }

}