import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { RoleEnum } from 'src/common/enums/role.enums';

@Injectable()
export class RoleRepository {

  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument> 
  ) {}

  async createRole(data: any) {
    return await this.roleModel.create(data);
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findByName(name: RoleEnum) {
    return await this.roleModel.findOne({name});
  }

}