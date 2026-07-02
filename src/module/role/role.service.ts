import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleEnum } from 'src/common/enums/role.enums';
import { CreateRoleDto } from './dto/create-role.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class RoleService {

    constructor(
    private readonly roleRepository: RoleRepository,
  ) {}

  async createRole( data: CreateRoleDto) {
    const existingRole = await this.roleRepository.findByName(data.name);

    if ( existingRole ) { 
       throw new NotFoundException('Role already exists');
    }

    return this.roleRepository.createRole( data );
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const skip = (page - 1) * limit;

    return this.roleRepository.findAll(skip, limit, page);
  }

  async findByName(name: RoleEnum) {
    const role = await this.roleRepository.findByName(name);

    if(!role) {
      throw new NotFoundException('Role not Found');
    }

    return role;
  }

  async findById(id: string) {
  const role = await this.roleRepository.findById(id);

  if (!role) {
    throw new NotFoundException('Role not found');
  }

  return role;
}

}