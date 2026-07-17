import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from "@nestjs/common";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { DepartmentService } from "./department.service";
import { PaginationDto } from "../../common/pagination/dto/pagination.dto";

@Controller('department')
export class DepartmentController {

    constructor(
        private readonly departmentService: DepartmentService,
    ){}

    @Post('create')
    async createDepartment( @Body() createDepartmentDto: CreateDepartmentDto){
        return await this.departmentService.createDepartment(createDepartmentDto)
    }

    @Get('all')
    async findAll(@Query() paginationDto: PaginationDto){
        return await this.departmentService.findAll(paginationDto)
    }

    @Get(':id')
    async findById( @Param('id') id: string){
        return await this.departmentService.findOne(id);
    }

    @Patch(':id')
    async update( @Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return await this.departmentService.update(id, updateDepartmentDto );
  }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.departmentService.delete(id);
    }

} 