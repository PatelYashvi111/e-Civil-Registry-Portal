import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfficeDepartment } from './schema/officeDepartment.schema';
import { CreateOfficeDepartmentDto } from './dto/create-officeDepartment.dto';
import { UpdateOfficeDepartmentDto } from './dto/update-officeDepartment.dto';

@Injectable()
export class OfficeDepartmentRepository {
  constructor(
    @InjectModel(OfficeDepartment.name)
    private model: Model<OfficeDepartment>,
  ) {}

  async create(createOfficeDepartmentDto: CreateOfficeDepartmentDto) {
    return await this.model.create(createOfficeDepartmentDto);
  }

  async findAll() {
    return await this.model
      .find()
      .populate('officeId')
      .populate('departmentId');
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }
  
   async findMapping( officeId: string, departmentId: string ) {
    return await this.model.findOne({ officeId, departmentId });
  }

  async findByOffice(officeId: string) {
    return await this.model
      .find({ officeId })
      .populate('departmentId');
  }

  async findByDepartment(departmentId: string) {
    return await this.model
      .find({ departmentId })
      .populate('officeId');
  }

  async update(id: string, updateOfficeDepartmentDto: UpdateOfficeDepartmentDto) {
    return await this.model.findByIdAndUpdate( id, updateOfficeDepartmentDto, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete( id );
  }
  
}