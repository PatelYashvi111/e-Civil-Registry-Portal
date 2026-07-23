import { Controller, Post, Get, Patch, Delete, Body, Param, UseInterceptors, Request, Response, UploadedFiles, Query } from '@nestjs/common';
import { CreateBirthDto } from './dto/create-birth.dto';
import { UpdateBirthDto } from './dto/update-birth.dto';
import { BirthService } from './birth.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';

@Controller('birth')
export class BirthController {

    constructor(
      private readonly birthService: BirthService
    ){}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'fatherAadharCard', maxCount: 1 },
        { name: 'motherAadharCard', maxCount: 1 },
        { name: 'marriageCertificate', maxCount: 1 },
        { name: 'birthHospitalReport', maxCount: 1 },
        { name: 'rationCard', maxCount: 1 },
      ]),
    )
    async create(
      @Body() createBirthDto: CreateBirthDto,
      @Request() req,
      @UploadedFiles() files: {
        fatherAadharCard?: Express.Multer.File[];
        motherAadharCard?: Express.Multer.File[];
        marriageCertificate?: Express.Multer.File[];
        birthHospitalReport?: Express.Multer.File[];
        rationCard?: Express.Multer.File[];
      },
    ) {
      return await this.birthService.create(
        createBirthDto,
        req.user,
        {
          fatherAadharCard: files?.fatherAadharCard,
          motherAadharCard: files?.motherAadharCard,
          marriageCertificate: files?.marriageCertificate,
          birthHospitalReport: files?.birthHospitalReport,
          rationCard: files?.rationCard,
        },
      );
    }

    @Get('all')
    async findAll(@Query() paginationDto: PaginationDto) {
        return await this.birthService.findAll(paginationDto);
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