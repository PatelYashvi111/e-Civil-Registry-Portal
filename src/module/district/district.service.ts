import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { DistrictRepository } from './district.repository';


@Injectable()
export class DistrictService {
  
    constructor(
     private readonly districtRepository: DistrictRepository, 
  ) {}

  async create(createDistrictDto: CreateDistrictDto) {
    return await this.districtRepository.create(createDistrictDto);
  }

  async findAll() {
    return await this.districtRepository.findAll()
  }

  async findOne(id: string) {
    return await this.districtRepository.findById(id);
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    return await this.districtRepository.update(id, updateDistrictDto);
  }

  async delete(id: string) {
    return await this.districtRepository.delete(id);
  }
}