import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
 
    constructor(
    private readonly stateRepository: StateRepository, 
  ) {}

  async create(createStateDto: CreateStateDto) {
    return await this.stateRepository.create(createStateDto);
  }

  async findAll() {
    return await this.stateRepository.findAll();
  }

  async findById(id: string) {
    return await this.stateRepository.findById(id);
  }

  async update(id: string, updateStateDto: UpdateStateDto) {
    return await this.stateRepository.update(id, updateStateDto);
  }

  async delete(id: string) {
    return await this.stateRepository.delete(id);
  }
}