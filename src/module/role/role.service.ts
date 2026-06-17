import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoleRepository } from './role.repository';
import { Role } from './schema/role.schema';
import { RoleEnum } from 'src/common/enums/role.enums';

@Injectable()
export class RoleService {

    constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async createRole(data:any) {
    return this.roleRepository.createRole( data );
  }

  async findAll() {
    return this.roleRepository.findAll();
  }

  async findByName(name: RoleEnum) {
    return this.roleRepository.findByName(name);
  }

}