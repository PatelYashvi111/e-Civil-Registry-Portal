import { Injectable } from '@nestjs/common';
import { CreateOfficeDepartmentDto } from './dto/create-officeDepartment.dto';
import { OfficeDepartmentRepository } from './officeDepartment.repository';

@Injectable()
export class OfficeDepartmentService {
  
    constructor(
     private readonly officeDepartmentRepository: OfficeDepartmentRepository,
  ) {}

  async create(createOfficeDepartmentDto: CreateOfficeDepartmentDto) {
    return await this.officeDepartmentRepository.create(createOfficeDepartmentDto);
  }

  async findAll() {
    return await this.officeDepartmentRepository.findAll()
  }

   async delete(id: string) {
    return await this.officeDepartmentRepository.delete(id);
  }

  async getByOffice(officeId: string) {
    return await this.officeDepartmentRepository.findByOffice(officeId);
  }

  async getByDepartment(departmentId: string) {
    return await this.officeDepartmentRepository.findByDepartment(departmentId);
  }

}