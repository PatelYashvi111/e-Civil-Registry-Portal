import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOfficeDepartmentDto } from './dto/create-officeDepartment.dto';
import { OfficeDepartmentRepository } from './officeDepartment.repository';
import { OfficeRepository } from '../office/office.repository';
import { DepartmentRepository } from '../department/department.repository';
import { UpdateOfficeDepartmentDto } from './dto/update-officeDepartment.dto';

@Injectable()
export class OfficeDepartmentService {
  
    constructor(
     private readonly officeDepartmentRepository: OfficeDepartmentRepository,
     private readonly officeRepository: OfficeRepository,
     private readonly departmentRepository: DepartmentRepository,
   ) {}

  async create(createOfficeDepartmentDto: CreateOfficeDepartmentDto) {
    const office = await this.officeRepository.findById(createOfficeDepartmentDto.officeId);

    if(!office){
      throw new NotFoundException('Office Not Found');
    }
    
    const department = await this.departmentRepository.findById(createOfficeDepartmentDto.departmentId);

    if(!department){
      throw new NotFoundException('Department Not Found');
    }
    
    const existingMapping = await this.officeDepartmentRepository.findMapping(
      createOfficeDepartmentDto.officeId,
      createOfficeDepartmentDto.departmentId
    );

    if(existingMapping) {
      throw new BadRequestException('Mapping already exists');
    }

    return await this.officeDepartmentRepository.create(createOfficeDepartmentDto);
  }

  async findAll() {
    return await this.officeDepartmentRepository.findAll();
  }

  async findOne(id: string) {
    const mapping = await this.officeDepartmentRepository.findById(id);

    if(!mapping) {
      throw new NotFoundException('Mapping Not Found')
    }

    return mapping;
  }

  async getByOffice(officeId: string) {
    return await this.officeDepartmentRepository.findByOffice(officeId);
  }

  async getByDepartment(departmentId: string) {
    return await this.officeDepartmentRepository.findByDepartment(departmentId);
  }

  async update(id: string, updateOfficeDepartmentDto: UpdateOfficeDepartmentDto) {
    const mapping = await this.officeDepartmentRepository.findById(id);

    if (!mapping) {
      throw new NotFoundException('Mapping Not Found');
    }

    const officeId = updateOfficeDepartmentDto.officeId ?? mapping.officeId.toString();
    const departmentId = updateOfficeDepartmentDto.departmentId ?? mapping.departmentId.toString();

    const existingMapping = await this.officeDepartmentRepository.findMapping(officeId, departmentId);

    if (existingMapping && existingMapping.id !== id) {
      throw new BadRequestException('Mapping already exists');
    }

    return await this.officeDepartmentRepository.update(id, updateOfficeDepartmentDto);
  }
  
  async delete(id: string) {
    const mapping = await this.officeDepartmentRepository.findById(id);

    if(!mapping) {
      throw new NotFoundException('Mapping Not Found');
    }

    return await this.officeDepartmentRepository.delete(id);
  }
}