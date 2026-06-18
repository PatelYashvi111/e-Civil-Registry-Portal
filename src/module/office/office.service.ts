import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficeRepository } from './office.repository';

@Injectable()
export class DistrictService {
  
    constructor(
    private readonly officeRepository: OfficeRepository, 
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    return await this.officeRepository.create(createOfficeDto);
  }

  async findAll() {
    return await this.officeRepository.findAll()
  }

  async findOne(id: string) {
    return await this.officeRepository.findById(id);
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    return await this.officeRepository.update(id, updateOfficeDto);
  }

  async delete(id: string) {
    return await this.officeRepository.delete(id);
  }
}