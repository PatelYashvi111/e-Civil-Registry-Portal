import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfficeDepartment } from './schema/officeDepartment.schema';
import { CreateOfficeDepartmentDto } from './dto/create-officeDepartment.dto';
import { UpdateOfficeDepartmentDto } from './dto/update-officeDepartment.dto';
import { toObjectId } from 'src/common/utils/objectId.utils';

@Injectable()
export class OfficeDepartmentRepository {
  constructor(
    @InjectModel(OfficeDepartment.name)
    private model: Model<OfficeDepartment>,
  ) {}

  async create(createOfficeDepartmentDto: CreateOfficeDepartmentDto) {
    const officeDepartmentData = {
      ...CreateOfficeDepartmentDto,
      officeId: toObjectId(createOfficeDepartmentDto.officeId),
      departmentId: toObjectId(createOfficeDepartmentDto.departmentId),
    }
    return await this.model.create(officeDepartmentData);
  }

  async findAll(skip: number, limit: number, page: number) {
    const data = await this.model.find().skip(skip).limit(limit).sort({createdAt: -1}).populate('officeId').populate('departmentId');
    const total = await this.model.countDocuments();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }
  
  async findByName(name: string) {
    return await this.model.findOne({ name });
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
    return await this.model.findByIdAndUpdate( id, updateOfficeDepartmentDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete( id );
  }
  
}