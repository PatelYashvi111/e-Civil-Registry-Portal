import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { RoleEnum } from 'src/common/enums/role.enums';
import { CreateRoleDto } from './dto/create-role.dto';
import { PaginationUtil } from 'src/common/utils/pagination.utils';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class RoleRepository {

  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument> 
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    return await this.roleModel.create(createRoleDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    
    const skip = PaginationUtil.getSkip(page, limit);
    
    const data =await this.roleModel.find().skip(skip).limit(limit);
    
    const total = await this.roleModel.countDocuments();
    
    return PaginationUtil.getPaginationResponse(
      data,
      total,
      page,
      limit,
    );
  }

  async findByName(name: RoleEnum) {
    return await this.roleModel.findOne({name});
  }

  async findById(id: string) {
    return this.roleModel.findById(id);
  }

}