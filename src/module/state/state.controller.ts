import { Controller, Post, Get, Patch, Delete, Body, Param} from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('state')
export class StateController {
  
    constructor(
    private readonly stateService: StateService,
  ) {}

  @Post('create')
  async create( @Body() createStateDto: CreateStateDto ) {
    return this.stateService.create(createStateDto);
  }

  @Get('all')
  async findAll() {
    return this.stateService.findAll();
  }

  @Get(':id')
  async findById( @Param('id') id: string ) {
    return this.stateService.findById(id);
  }

  @Patch(':id')
  async update( @Param('id') id: string, @Body() updateStateDto: UpdateStateDto ) {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete(':id')
  async delete( @Param('id') id: string ) {
    return this.stateService.delete(id);
  }
}