import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepository } from './department.repository';

@Injectable()
export class DepartmentService {
 
    constructor(
      private readonly departmentRepository: DepartmentRepository, 
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentRepository.create(createDepartmentDto);
  }

  async findAll() {
    return await this.departmentRepository.findAll();
  }

  async findOne(id: string) {
    return await this.departmentRepository.findById(id);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return await this.departmentRepository.update(id, updateDepartmentDto);
  }

  async delete(id: string) {
    return await this.departmentRepository.delete(id);
  }
}