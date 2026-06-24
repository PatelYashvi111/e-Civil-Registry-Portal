import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthDto } from './dto/update-birth.dto';
import { BirthService } from './birth.service';

@Controller('birth')
export class BirthController {

    constructor(
      private readonly birthService: BirthService
    ){}

    @Post('create')
    async create( @Body() createBirthDto: CreateBirthDto) {
        return await this.birthService.create( createBirthDto );
    }

    @Get('all')
    async findAll() {
        return await this.birthService.findAll();
    }

    @Get(':id')
    async findById( @Param('id') id: string) {
        return await this.birthService.findById( id )
    }

    @Patch(':id')
    async update( @Param('id') id: string, @Body() updateBirthDto: UpdateBirthDto ) {
        return await this.birthService.update( id, updateBirthDto );
    }

    @Delete(':id')
    async delete( @Param('id') id: string ) {
        return await this.birthService.delete( id );
    }

}