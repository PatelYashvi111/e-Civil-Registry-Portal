import { Controller, Get, Param, Post ,Body, Query} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEnum } from 'src/common/enums/role.enums';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService
    ) {}

   @Post('create')
   async createRole (@Body() body: any) {
    return this.roleService.createRole( body );
   }

   @Get('all')
   async findAll(@Query() paginationDto: PaginationDto) {
    return this.roleService.findAll(paginationDto);
   }

     @Get(':id')
  async findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

   @Get(':name')
    async findByName(@Param('name') name: RoleEnum){
     return this.roleService.findByName( name );
   }

}