import { Controller, Post, Get, Patch, Delete, Body, Param, Query} from '@nestjs/common';
import { OfficeDepartmentService } from './officeDepartment.service';
import { CreateOfficeDepartmentDto } from './dto/create-officeDepartment.dto';
import { UpdateOfficeDepartmentDto } from './dto/update-officeDepartment.dto';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

@Controller('office-department')
export class OfficeDepartmentController {
  
    constructor(
    private readonly officeDepartmentService: OfficeDepartmentService,
  ) {}

  @Post('create')
  async create( @Body() createOfficeDepartmentDto: CreateOfficeDepartmentDto ) {
    return this.officeDepartmentService.create( createOfficeDepartmentDto );
  }

  @Get('all')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.officeDepartmentService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne( @Param('id') id: string ) {
    return this.officeDepartmentService.findOne(id);
  }

  @Get('office/:officeId')
  async getByOffice( @Param('officeId') officeId: string ) {
    return this.officeDepartmentService.getByOffice( officeId );
  }

  @Get('department/:departmentId')
  async getByDepartment( @Param('departmentId') departmentId: string ) {
    return this.officeDepartmentService.getByDepartment( departmentId );
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateOfficeDepartmentDto: UpdateOfficeDepartmentDto ) {
    return this.officeDepartmentService.update( id, updateOfficeDepartmentDto );
  }

  @Delete(':id')
  async delete( @Param('id') id: string ) {
    return this.officeDepartmentService.delete(id);
  }
}