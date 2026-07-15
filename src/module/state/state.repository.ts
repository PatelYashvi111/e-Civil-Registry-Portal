import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { State } from '../state/schema/state.schema';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StateRepository {
  constructor(@InjectModel(State.name) private model: Model<State>) {}

  async create(createStateDto: CreateStateDto) {
    return await this.model.create(createStateDto);
  }

async findAll(
  skip: number,
  limit: number,
  page: number,
  search?: string,
) {
  const pipeline: any[] = [];

  // Search
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

  // Count Pipeline
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

  // Project
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

  async update(id: string, updateStateDto: UpdateStateDto) {
    return await this.model.findByIdAndUpdate(id, updateStateDto, { returnDocument: 'after' });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}