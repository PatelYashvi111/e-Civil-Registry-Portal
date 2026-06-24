import { Injectable, BadRequestException , NotFoundException} from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { DistrictRepository } from './district.repository';

@Injectable()
export class DistrictService {
  
    constructor(
     private readonly districtRepository: DistrictRepository, 
  ) {}

  async create(createDistrictDto: CreateDistrictDto) {
  const name = createDistrictDto.name.trim().toLowerCase();

  const existingDistrict = await this.districtRepository.findByName(name);

  if (existingDistrict) {
    throw new BadRequestException('District already exists');
  }

  return await this.districtRepository.create({...createDistrictDto,name });
}
  async findAll() {
    return await this.districtRepository.findAll();  
  }

  async findOne(id: string) {
    const district = await this.districtRepository.findById(id);

    if(!district) {
      throw new NotFoundException('District not found');
    }

    return district;
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.districtRepository.findById(id);

    if (!district) {
      throw new NotFoundException('District not found');
    }

    if (updateDistrictDto.name) {
      const existingDistrict = await this.districtRepository.findByName(updateDistrictDto.name.trim().toLowerCase());

      if (existingDistrict && existingDistrict.id !== id) {
        throw new BadRequestException('District already exists');
      }
    }

    return await this.districtRepository.update(id, updateDistrictDto);
  }

  async delete(id: string) {
    const district = await this.districtRepository.delete(id);

    if(!district) {
      throw new NotFoundException('District not found');
    }

    return district;
  
  }
}