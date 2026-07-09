import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model, Types, UpdateQuery } from 'mongoose';
import { Holiday, HolidayDocument } from './schema/holiday.schema';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@Injectable()
export class HolidayRepository {
  constructor(
    @InjectModel(Holiday.name)
    private readonly holidayModel: Model<HolidayDocument>,
  ) {}

  async createHoliday( createHolidayDto: CreateHolidayDto ) {
    const holiday = new this.holidayModel(createHolidayDto);
    return await holiday.save();
  }

  async findAll( filter: QueryFilter<HolidayDocument> = {} ) {
    return await this.holidayModel.find(filter);
  }

  async findById(id: string) {
    return await this.holidayModel.findById(id);
  }
  
  async findOne( filter: QueryFilter<HolidayDocument> ) {
    return await this.holidayModel.findOne(filter);
  }
  
  async findByHolidayDate( holidayDate: Date ) {
    return await this.holidayModel.findOne({ holidayDate });
  }

  async findByYear(year: number): Promise<HolidayDocument[]> {
    return await this.holidayModel.find({ year });
  }

  async findByOffice( officeId: Types.ObjectId ): Promise<HolidayDocument[]> {
    return await this.holidayModel.find({ officeId });
  }

  async updateHoliday( id: string, updateHolidayDto: UpdateHolidayDto ) {
    return await this.holidayModel.findByIdAndUpdate( id, updateHolidayDto, { new: true, runValidators: true });
  }

  async deleteHoliday(id: string) {
    return await this.holidayModel.findByIdAndDelete(id);
  }

}