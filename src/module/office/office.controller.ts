import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

@Controller('office')
export class OfficeController {
  
    constructor(
    private readonly officeService: OfficeService,
  ) {}

  @Post('create')
  async create( @Body() createOfficeDto: CreateOfficeDto ) {
    return this.officeService.create(createOfficeDto);
  }

  @Get('all')
  async findAll() {
    return this.officeService.findAll();
  }

  @Get(':id')
  async findOne( @Param('id') id: string ) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto ) {
    return this.officeService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  async delete( @Param('id') id: string ) {
    return this.officeService.delete(id);
  }
}