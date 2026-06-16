import { Controller, Get, Param, Post ,Body} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEnum } from 'src/common/enums/role.enums';

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
   async findAll() {
    return this.roleService.findAll();
   }

   @Get(':name')
    async findByName(@Param('name') name: RoleEnum){
     return this.roleService.findByName( name );
   }

}