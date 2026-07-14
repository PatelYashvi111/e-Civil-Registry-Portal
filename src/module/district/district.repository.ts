import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District } from '../district/schema/district.schema';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictRepository {
  
    constructor(
        @InjectModel(District.name) 
        private model: Model<District>
    ) {}

  async create(createDistrictDto: CreateDistrictDto) {
    return await this.model.create(createDistrictDto);
  }

  
async findAll(
  skip: number,
  limit: number,
  page: number,
  search?: string,
) {
  const pipeline: any[] = [
    {
      $lookup: {
        from: 'states',
        localField: 'stateId',
        foreignField: '_id',
        as: 'district',
      },
    },
    {
      $unwind: {
        path: '$state',
        preserveNullAndEmptyArrays: true,
      },
    },

  ];

  // Search
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          {
            name: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'state.name': {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      },
    });
  }

  // Count
  const countPipeline = [...pipeline];

  countPipeline.push({
    $count: 'total',
  });

  const countResult = await this.model.aggregate(countPipeline);

  const total = countResult.length ? countResult[0].total : 0;

  // Sorting
  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  // Pagination
  pipeline.push(
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  );

  // Output fields
  pipeline.push({
    $project: {
      _id: 1,
      name: 1,
      createdAt: 1,
      districtName: '$district.name',
      stateName: '$state.name',
    },
  });

  const data = await this.model.aggregate(pipeline);

  return {
    data,
    total,
    page,
    limit,
    search,
    totalPages: Math.ceil(total / limit),
  };
}

  async findByName(name: string) {
    return await this.model.findOne({ name });
  }
  
  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    return await this.model.findByIdAndUpdate(id, updateDistrictDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}