import { Injectable } from '@nestjs/common';
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
    await this.holidayRepository.createHoliday(createHolidayDto);

    return {
      message: 'Holiday created successfully.',
    };
  }

  async findAll() {
    return await this.holidayRepository.findAll();
  }

  async findById(id: string) {
    return await this.holidayRepository.findById(id);
  }

  async findByYear(year: number) {
    return await this.holidayRepository.findByYear(year);
  }

  async findByOffice(officeId: string) {
    return await this.holidayRepository.findByOffice(
      new Types.ObjectId(officeId),
    );
  }

  async updateHoliday(
    id: string,
    updateHolidayDto: UpdateHolidayDto,
  ) {
    await this.holidayRepository.updateHoliday(id, updateHolidayDto);

    return {
      message: 'Holiday updated successfully.',
    };
  }

  async deleteHoliday(id: string) {
    await this.holidayRepository.deleteHoliday(id);

    return {
      message: 'Holiday deleted successfully.',
    };
  }
}