import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District } from '../district/schema/district.schema';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { toObjectId } from 'src/common/utils/objectId.utils';


@Injectable()
export class DistrictRepository {
  
    constructor(
        @InjectModel(District.name) 
        private model: Model<District>
    ) {}

  async create(createDistrictDto: CreateDistrictDto) {
      const createdDistrict= new this.model({
    ...createDistrictDto,
    stateId: toObjectId(createDistrictDto.stateId),
  });

  return createdDistrict.save();
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
        as: 'state',
      },
    },
    {
      $unwind: {
        path: '$state',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

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

  const countPipeline = [...pipeline];
  countPipeline.push({
    $count: 'total',
  });

  const countResult = await this.model.aggregate(countPipeline);

  const total = countResult.length ? countResult[0].total : 0;

  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  pipeline.push(
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  );

  pipeline.push({
    $project: {
      _id: 1,
      name: 1,
      createdAt: 1,
      stateId: {
        _id: '$state._id',
        name: '$state.name',
      },
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
    return await this.model.findById(id).populate('stateId');
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    return await this.model.findByIdAndUpdate(id, updateDistrictDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}