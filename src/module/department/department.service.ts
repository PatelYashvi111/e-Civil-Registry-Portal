import { Injectable, BadRequestException,NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepository } from './department.repository';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

@Injectable()
export class DepartmentService {
 
    constructor(
      private readonly departmentRepository: DepartmentRepository, 
  ) {}

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    const existingDepartment = await this.departmentRepository.findByName(createDepartmentDto.name.trim().toLowerCase());
    
    if (existingDepartment) {
      throw new BadRequestException('Department already exists');
    }
   return await this.departmentRepository.createDepartment(createDepartmentDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page=1, limit=10 } = paginationDto;

    const skip = (page-1) * limit;

    return await this.departmentRepository.findAll(skip, limit, page);
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