import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Office } from '../office/schema/office.schema';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { toObjectId } from 'src/common/utils/objectId.utils';

@Injectable()
export class OfficeRepository {
  
    constructor(
        @InjectModel(Office.name) 
        private model: Model<Office>
    ) {}

  async createOffice(createOfficeDto: CreateOfficeDto) {

  const createdOffice = new this.model({
    ...createOfficeDto,
    districtId: toObjectId(createOfficeDto.districtId),
  });

  return createdOffice.save();
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
        from: 'districts',
        localField: 'districtId',
        foreignField: '_id',
        as: 'district',
      },
    },
    {
      $unwind: {
        path: '$district',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'states',
        localField: 'district.stateId',
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
            'district.name': {
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
      $limit: Number(limit),
    },
  );

  pipeline.push({
    $project: {
      _id: 1,
      name: 1,
      createdAt: 1,
      districtId: {
        _id: '$district._id',
        name: '$district.name',
    
      stateId: {
        _id: '$state._id',
        name: '$state.name',
      },
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
    return await this.model.findById(id);
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    return await this.model.findByIdAndUpdate(id, updateOfficeDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

}