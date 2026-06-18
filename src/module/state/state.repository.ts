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

  async findAll() {
    return await this.model.find();
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, updateStateDto: UpdateStateDto) {
    return await this.model.findByIdAndUpdate(id, updateStateDto, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}