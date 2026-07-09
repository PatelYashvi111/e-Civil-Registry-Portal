import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@Controller('holiday')
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService,
  ) {}

  @Post('create')
  async createHoliday( @Body() createHolidayDto: CreateHolidayDto ) {
    return await this.holidayService.createHoliday(createHolidayDto);
  }

  @Get('all')
  async findAll() {
    return await this.holidayService.findAll();
  }

  @Get(':id')
  async findById( @Param('id') id: string ) {
    return await this.holidayService.findById(id);
  }

  @Get('year/:year')
  async findByYear( @Param('year') year: number ) {
    return await this.holidayService.findByYear(Number(year));
  }

  @Get('office/:officeId')
  async findByOffice( @Param('officeId') officeId: string ) {
    return await this.holidayService.findByOffice(officeId);
  }

  @Patch(':id')
  async updateHoliday( @Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto,
  ) {
    return await this.holidayService.updateHoliday( id, updateHolidayDto );
  }

  @Delete(':id')
  async deleteHoliday( @Param('id') id: string ) {
    return await this.holidayService.deleteHoliday(id);
  }
}