import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { HolidayRepository } from './holiday.repository';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    private readonly holidayRepository: HolidayRepository,
  ) {}

  async createHoliday(createHolidayDto: CreateHolidayDto) {
  const { holidayDate } = createHolidayDto;

  const existingHoliday = await this.holidayRepository.findOne({holidayDate, officeId: new Types.ObjectId(createHolidayDto.officeId) })

  if(existingHoliday) {
      throw new BadRequestException('Holiday already exists');
  }

  if(holidayDate.getFullYear() !== createHolidayDto.year) {
    throw new BadRequestException('year does not match holiday date');
  }

  if(createHolidayDto.isNationalHoliday) {
    const existingNationalHoliday = await this.holidayRepository.findOne({holidayDate, isNationalHoliday: true});

    if(existingNationalHoliday) {
      throw new BadRequestException('National holiday already exists');
    }
  }
   return await this.holidayRepository.createHoliday({...createHolidayDto, holidayDate});

  }

  async findAll() {
    return await this.holidayRepository.findAll();
  }

  async findById(id: string) {
    const holiday = await this.holidayRepository.findById(id);

    if (!holiday) {
      throw new NotFoundException('Holiday not found');
    }

    return holiday;
  }

  async findByYear(year: number) {
    return await this.holidayRepository.findByYear(year);
  }

  async findByOffice(officeId: string) {
    return await this.holidayRepository.findByOffice(
      new Types.ObjectId(officeId),
    );
  }

  async updateHoliday( id: string, updateHolidayDto: UpdateHolidayDto ) {
    const holiday = await this.holidayRepository.findById(id);

    if(!holiday) {
      throw new NotFoundException('Holiday not found');
    }

    return await this.holidayRepository.updateHoliday(id,updateHolidayDto);
  }

  async deleteHoliday(id: string) {
    const holiday = await this.holidayRepository.findById(id);

    if(!holiday) {
      throw new NotFoundException('Holiday not found');
    }

    return await this.holidayRepository.deleteHoliday(id);

  }
}