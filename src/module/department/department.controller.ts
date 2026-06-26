import { Controller, Post, Get, Patch, Delete, Body, Param } from "@nestjs/common";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { DepartmentService } from "./department.service";

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
    async findAll(){
        return await this.departmentService.findAll()
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