import { Controller, Post, Get, Patch, Delete, Body, Param,} from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Controller('district')
export class DistrictController {
  
    constructor(
    private readonly districtService: DistrictService,
  ) {}

  @Post('create')
  async create( @Body() createDistrictDto: CreateDistrictDto ) {
    return this.districtService.create(createDistrictDto);
  }

  @Get('all')
  async findAll() {
    return this.districtService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateDistrictDto: UpdateDistrictDto ) {
    return this.districtService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  async delete( @Param('id') id: string ) {
    return this.districtService.delete(id);
  }
}