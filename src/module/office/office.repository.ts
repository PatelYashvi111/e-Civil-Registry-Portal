import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Office } from '../office/schema/office.schema';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

@Injectable()
export class OfficeRepository {
  
    constructor(
        @InjectModel(Office.name) 
        private model: Model<Office>
    ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    return await this.model.create(createOfficeDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return await this.model.find()
      .populate({path: 'districtId',populate: {path: 'stateId'}})
      .skip((page - 1) * limit)
      .limit(limit                                                                                  ); 
  }

  async findByName(name: string) {
    return await this.model.findOne({ name });
  }
  
  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    return await this.model.findByIdAndUpdate(id, updateOfficeDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

}