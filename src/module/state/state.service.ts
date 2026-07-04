import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateRepository } from './state.repository';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

@Injectable()
export class StateService {
 
    constructor(
    private readonly stateRepository: StateRepository, 
  ) {}

  async create(createStateDto: CreateStateDto) {
    const existingState = await this.stateRepository.findByName(createStateDto.name.trim().toLowerCase());

    if(existingState) {
      throw new BadRequestException('State already exists');
    }

    return await this.stateRepository.create(createStateDto);
  }

  async findAll(paginationDto: PaginationDto) {
      const {page=1, limit=10} = paginationDto;

      const skip = (page-1) * limit;

      return await this.stateRepository.findAll(skip, limit, page);
  }

  async findById(id: string) {
    const state = await this.stateRepository.findById(id);

    if(!state){
      throw new NotFoundException('State not found');
    }

    return state;
  }

  async update(id: string, updateStateDto: UpdateStateDto) {
      const state = await this.stateRepository.findById(id);

      if (!state) {
        throw new NotFoundException('State not found');
      }

      if(updateStateDto.name){
        const existingState = await this.stateRepository.findByName(updateStateDto.name.trim().toLowerCase());

      if (existingState && existingState.id !== id) {
        throw new BadRequestException('State already exists');
      }
    }

      return await this.stateRepository.update(id, updateStateDto);
  }

  async delete(id: string) {
    const state = await this.stateRepository.delete(id);

    if(!state) {
      throw new NotFoundException('State not found');
    }

     return state;
  }
}