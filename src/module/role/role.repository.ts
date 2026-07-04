import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { RoleEnum } from 'src/common/enums/role.enums';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleRepository {

  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument> 
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    return await this.roleModel.create(createRoleDto);
  }

  async findAll(skip: number, limit: number, page: number) {
    const data =await this.roleModel.find().skip(skip).limit(limit);
    const total = await this.roleModel.countDocuments();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      };
  }

  async findByName(name: RoleEnum) {
    return await this.roleModel.findOne({name});
  }

  async findById(id: string) {
    return this.roleModel.findById(id);
  }

}