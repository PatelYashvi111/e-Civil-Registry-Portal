import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfficeDepartment } from './schema/officeDepartment.schema';
import { CreateOfficeDepartmentDto } from './dto/create-officeDepartment.dto';
import { UpdateOfficeDepartmentDto } from './dto/update-officeDepartment.dto';
import { toObjectId } from 'src/common/utils/objectId.utils';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationUtil } from 'src/common/utils/pagination.utils';

@Injectable()
export class OfficeDepartmentRepository {
  constructor(
    @InjectModel(OfficeDepartment.name)
    private model: Model<OfficeDepartment>,
  ) {}

  async create(createOfficeDepartmentDto: CreateOfficeDepartmentDto) {
    const officeDepartmentData = {
      ...createOfficeDepartmentDto,
      officeId: toObjectId(createOfficeDepartmentDto.officeId),
      departmentId: toObjectId(createOfficeDepartmentDto.departmentId),
    }
    return await this.model.create(officeDepartmentData);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    
    const skip = PaginationUtil.getSkip(page, limit);

    const data = await this.model.find().skip(skip).limit(limit).sort({createdAt: -1}).populate('officeId').populate('departmentId');
    
    const total = await this.model.countDocuments();
    
    return PaginationUtil.getPaginationResponse(
      data,
      total,
      page,
      limit,
    );
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }
  
  async findByName(name: string) {
    return await this.model.findOne({ name });
  }

  async findMapping( officeId: string, departmentId: string ) {
    return await this.model.findOne({ 
      officeId: toObjectId(officeId),
    departmentId: toObjectId(departmentId),
    });
  }

  async findByOffice(officeId: string) {
    return await this.model
      .find({ officeId: toObjectId(officeId) })
      .populate('departmentId');
  }

  async findByDepartment(departmentId: string) {
    return await this.model
      .find({ departmentId: toObjectId(departmentId) })
      .populate('officeId');
  }

  async update(id: string, updateOfficeDepartmentDto: UpdateOfficeDepartmentDto) {
    return await this.model.findByIdAndUpdate( id, updateOfficeDepartmentDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete( id );
  }
  
}