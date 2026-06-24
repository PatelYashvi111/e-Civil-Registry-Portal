import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { CreateAadharDto } from './dto/create-aadhar.dto';
import { UpdateAadharDto } from './dto/update-aadhar.dto';
import { AadharService } from './aadhar.service';

@Controller('aadhar')
export class AadharController {
    
    constructor(
    private readonly aadharService: AadharService,
  ) {}

   @Post('create')
   async createAadhar( @Body() createAadharDto: CreateAadharDto){
    return this.aadharService.createAadhar(createAadharDto);
   }

   @Get('all')
   async findAll() {
    return this.aadharService.findAll();
   }

   @Get(':id')
   async findById( @Param('id') id: string ){
    return this.aadharService.findById( id );
   }

   @Get(':aadharNumber')
   async findByAadharNumber( @Param('aadharNumber') aadharNumber: string ){
    return this.aadharService.findByAadharNumber( aadharNumber );
   }

   @Patch(':id')
   async updateAadhar( @Param('id') id: string, @Body() updateAadharDto: UpdateAadharDto ){
    return this.aadharService.updateAadhar( id, updateAadharDto );
   }

   @Delete(':id')
   async deleteAadhar( @Param('id') id: string ){
    return this.aadharService.deleteAadhar( id );
   }
   
}