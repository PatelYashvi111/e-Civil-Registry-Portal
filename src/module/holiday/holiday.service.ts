import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { HolidayRepository } from './holiday.repository';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class HolidayService {
  constructor(
    private readonly holidayRepository: HolidayRepository,
  ) {}

  async createHoliday(createHolidayDto: CreateHolidayDto) {
    // const { holidayDate } = createHolidayDto;

      // Convert ISO string to Date
    const holidayDate = new Date(createHolidayDto.holidayDate);

    if (isNaN(holidayDate.getTime())) {
      throw new BadRequestException('Invalid holiday date');
    }

    const existingHoliday = await this.holidayRepository.findOne({
      holidayDate,
      officeId: new Types.ObjectId(createHolidayDto.officeId),
    });

    if (existingHoliday) {
      throw new BadRequestException('Holiday already exists');
    }

    if (holidayDate.getFullYear() !== createHolidayDto.year) {
      throw new BadRequestException('Year does not match holiday date');
    }

    if (createHolidayDto.isNationalHoliday) {
      const existingNationalHoliday =
        await this.holidayRepository.findOne({
          holidayDate,
          isNationalHoliday: true,
        });

      if (existingNationalHoliday) {
        throw new BadRequestException(
          'National holiday already exists',
        );
      }
    }

    return await this.holidayRepository.createHoliday({
      ...createHolidayDto,
      holidayDate,
  });
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.holidayRepository.findAll(paginationDto);
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

    if (!holiday) {
      throw new NotFoundException('Holiday not found');
    }

     // Convert ISO string to Date
  const holidayDate = updateHolidayDto.holidayDate
    ? new Date(updateHolidayDto.holidayDate)
    : holiday.holidayDate;

  // Validate date
  if (
    updateHolidayDto.holidayDate &&
    isNaN(holidayDate.getTime())
  ) {
    throw new BadRequestException('Invalid holiday date');
  }

    // if (
    //   updateHolidayDto.holidayDate &&
    //   updateHolidayDto.year &&
    //   updateHolidayDto.holidayDate.getFullYear() !== updateHolidayDto.year
    // ) {
    //   throw new BadRequestException( 'Year does not match holiday date' );
    // }

    // Check year
  if (
    updateHolidayDto.holidayDate &&
    updateHolidayDto.year &&
    holidayDate.getFullYear() !== updateHolidayDto.year
  ) {
    throw new BadRequestException(
      'Year does not match holiday date',
    );
  }

    if ( updateHolidayDto.holidayDate || updateHolidayDto.officeId ) {
      const existingHoliday = await this.holidayRepository.findOne({
          holidayDate,
          // updateHolidayDto.holidayDate ??
          // holiday.holidayDate,
          officeId: new Types.ObjectId(
          updateHolidayDto.officeId ?? holiday.officeId,
          ),
        });

      if ( existingHoliday && existingHoliday._id.toString() !== id ) {
        throw new BadRequestException( 'Holiday already exists' );
      }
    }

    if (updateHolidayDto.isNationalHoliday) {
      const existingNationalHoliday = await this.holidayRepository.findOne({
          holidayDate,
          // updateHolidayDto.holidayDate ??
          // holiday.holidayDate,
           isNationalHoliday: true,
        });

      if ( existingNationalHoliday && existingNationalHoliday._id.toString() !== id ) {
        throw new BadRequestException( 'National holiday already exists' );
      }
    }

    return await this.holidayRepository.updateHoliday( id,{ 
      ...updateHolidayDto,
     ...(updateHolidayDto.holidayDate && {
      holidayDate,
    }),
    });
  }

  async deleteHoliday(id: string) {
    const holiday = await this.holidayRepository.findById(id);

    if (!holiday) {
      throw new NotFoundException('Holiday not found');
    }

    return await this.holidayRepository.deleteHoliday(id);
  }
}