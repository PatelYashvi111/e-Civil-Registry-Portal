import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { State } from '../state/schema/state.schema';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationUtil } from 'src/common/utils/pagination.utils';

@Injectable()
export class StateRepository {
  constructor(@InjectModel(State.name) private model: Model<State>) {}

  async create(createStateDto: CreateStateDto) {
    return await this.model.create(createStateDto);
  }

async findAll(paginationDto: PaginationDto) {
  const { page = 1, limit = 5, search } = paginationDto;

  const skip = PaginationUtil.getSkip(page, limit);

  const pipeline: any[] = [];

  if (search) {
    pipeline.push({
      $match: {
        name: {
          $regex: search,
          $options: 'i',
        },
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
      updatedAt: 1,
    },
  });

  const data = await this.model.aggregate(pipeline);

  return {
    ...PaginationUtil.getPaginationResponse(
    data,
    total,
    page,
    limit,
    ),
    search,
  };
}

  async findByName(name: string) {
    return await this.model.findOne({ name });
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, updateStateDto: UpdateStateDto) {
    return await this.model.findByIdAndUpdate(id, updateStateDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}