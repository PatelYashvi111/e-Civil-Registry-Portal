import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficeRepository } from './office.repository';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { PaginationUtil } from 'src/common/utils/pagination.utils';

@Injectable()
export class OfficeService {
  
    constructor(
    private readonly officeRepository: OfficeRepository, 
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    const existingOffice = await this.officeRepository.findByName(createOfficeDto.name.trim().toLowerCase());

    if(existingOffice) {
      throw new BadRequestException('Office already exists');
    }

      return await this.officeRepository.createOffice(createOfficeDto);

  }

  async findAll(paginationDto: PaginationDto) {
    return await this.officeRepository.findAll(paginationDto);
  }

  async findOne(id: string) {
    const office = await this.officeRepository.findById(id);

    if(!office) {
      throw new NotFoundException('Office not found');
    }

    return office;
  }

  async findByName(name: string) {
  return this.officeRepository.findByName(name);
}

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    const office = await this.officeRepository.findById(id);
    
    if (!office) {
      throw new NotFoundException('Office not found');
    }

    if (updateOfficeDto.name) {
    const existingOffice = await this.officeRepository.findByName(updateOfficeDto.name.trim().toLowerCase());

    if (existingOffice && existingOffice.id !== id) {
      throw new BadRequestException('Office already exists');
    }
  }
    return await this.officeRepository.update( id, updateOfficeDto );
  }

 async delete(id: string) {
    const office = await this.officeRepository.findById(id);

    if(!office) {
      throw new NotFoundException('Office not found');
    }

    return await this.officeRepository.delete(id);
  }
}