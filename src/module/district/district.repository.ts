import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District } from '../district/schema/district.schema';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictRepository {
  
    constructor(
        @InjectModel(District.name) 
        private model: Model<District>
    ) {}

  async create(createDistrictDto: CreateDistrictDto) {
    return await this.model.create(createDistrictDto);
  }

  async findAll() {
    return await this.model.find().populate('stateId');
  }

  async findByName(name: string) {
    return await this.model.findOne({ name });
  }
  
  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    return await this.model.findByIdAndUpdate(id, updateDistrictDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}