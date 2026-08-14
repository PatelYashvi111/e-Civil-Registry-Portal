import { Get, Post, Patch, Delete, Body, Controller, Param, UseInterceptors,Request, UploadedFiles, Query } from '@nestjs/common';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { DeathService } from './death.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';

@Controller('death')
export class DeathController {

    constructor(
        private readonly deathService: DeathService
    ){}
    
@Post('create')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'deceasedAadharCard', maxCount: 1 },
    { name: 'applicantAadharCard', maxCount: 1 },
    { name: 'deceasedRationCard', maxCount: 1 },
    { name: 'deceasedPhoto', maxCount: 1 },
    { name: 'deceasedMedicalCertificate', maxCount: 1 },
    { name: 'pmReport', maxCount: 1 },
    { name: 'fir', maxCount: 1 },
  ]),
)
async create(
  @Body() createDeathDto: CreateDeathDto,
  @Request() req,
  @UploadedFiles()
  files: {
    deceasedAadharCard?: Express.Multer.File[];
    applicantAadharCard?: Express.Multer.File[];
    deceasedRationCard?: Express.Multer.File[];
    deceasedPhoto?: Express.Multer.File[];
    deceasedMedicalCertificate?: Express.Multer.File[];
    pmReport?: Express.Multer.File[];
    fir?: Express.Multer.File[];
  },
) {
  return await this.deathService.create(
    createDeathDto,
    req.user, {
    deceasedAadharCard: files?.deceasedAadharCard,
    applicantAadharCard: files?.applicantAadharCard,
    deceasedRationCard: files?.deceasedRationCard,
    deceasedPhoto: files?.deceasedPhoto,
    deceasedMedicalCertificate: files?.deceasedMedicalCertificate,
    pmReport: files?.pmReport,
    fir: files?.fir,
  });
}

    @Get('all')
    async findAll(@Query()paginationDto: PaginationDto){
        return this.deathService.findAll(paginationDto);
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
