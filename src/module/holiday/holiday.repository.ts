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

  async findAll( 
    skip: number, 
    limit: number,
    page: number, 
    search?: string
  ) {
   
    const pipeline: any[] = [
  {
    $lookup: {
      from: 'offices',
      localField: 'officeId',
      foreignField: '_id',
      as: 'office',
    },
  },
  {
    $unwind: {
      path: '$office',
      preserveNullAndEmptyArrays: true,
    },
  },
];
    if(search) {
      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: search,
                $options: 'i',

              }
            },
            {
              description: {
                $regex: search,
                $options: 'i',
              }
            },
            {
              holidayDate: {
                $regex: search,
                $options: 'i',
              }
            },
            {
              year: {
                $regex: search,
                $options: 'i',
              }
            },
            {
              isNationalHoliday: {
                $regex: search,
                $options: 'i',
              }
            }
          ]
        }
      })
    }

    const countPipeline = [...pipeline];

    countPipeline.push({
      $count: 'total',
    });

    const countResult = await this.holidayModel.aggregate(countPipeline);

    const total = countResult.length > 0 ? countResult[0].total : 0;

    pipeline.push({
      $sort: {
        createdAt: -1,
      }
    });

    pipeline.push({
      $skip: skip,
    }, {
      $limit: limit,
    });

   const data = await this.holidayModel.aggregate(pipeline);

  return {
  data,
  total,
  page,
  limit,
  search,
  totalPages: Math.ceil(total / limit),
};
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