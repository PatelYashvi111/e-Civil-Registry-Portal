import { Controller, Get, Param, Post, Body, Patch, Delete, UploadedFile, UseInterceptors, Query} from '@nestjs/common';
import { CreateAadharDto } from './dto/create-aadhar.dto';
import { UpdateAadharDto } from './dto/update-aadhar.dto';
import { AadharService } from './aadhar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('aadhar')
export class AadharController {
    
    constructor(
    private readonly aadharService: AadharService,
  ) {}

   @Post('create')
   @UseInterceptors(
    FileInterceptor('photo', {})
  )
  async createAadhar(
    @Body() dto: CreateAadharDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.aadharService.createAadhar(dto, file);
  }

   @Get('all')
   async findAll(@Query() paginationDto: PaginationDto) {
    return this.aadharService.findAll(paginationDto);
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