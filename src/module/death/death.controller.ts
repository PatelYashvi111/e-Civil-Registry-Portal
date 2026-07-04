import { Get, Post, Patch, Delete, Body, Controller, Param, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { DeathService } from './death.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

@Controller('death')
export class DeathController {

    constructor(
        private readonly deathService: DeathService
    ){}
    
    @Post('create')
    @UseInterceptors(
    FileFieldsInterceptor([
    { name: 'deceasedAadharCard', maxCount: 1 },
    { name: 'spouseAadharCard', maxCount: 1 },
    { name: 'deceasedRationCard', maxCount: 1 },
    { name: 'deceasedPhoto', maxCount: 1 },
    { name: 'deceasedMedicalCertificate', maxCount: 1 },
    { name: 'pmReport', maxCount: 1 },
    { name: 'fir', maxCount: 1 },
  ]),
)
    async create( @Body()  createDeathDto: CreateDeathDto, @UploadedFiles() files: any){
        return this.deathService.create( createDeathDto, files);
    }

    @Get('all')
    async findAll(){
        return this.deathService.findAll();
    }

    @Get(':id')
        async findById( @Param('id') id: string ){
        return this.deathService.findById( id );
    }

    @Patch(':id')
    async update( @Param('id') id: string, @Body() updateDeathDto: UpdateDeathDto){
        return this.deathService.update( id, updateDeathDto );
    }

    @Delete(':id')
    async deleteUser( @Param('id') id: string ){
        return this.deathService.delete( id );
    }

}
