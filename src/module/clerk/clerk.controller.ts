import { Body, Controller, Post, Get, Patch, Delete, Param, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ClerkService } from './clerk.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { UpdateClerkDto } from './dto/update-clerk.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('clerk')
export class ClerkController {

  constructor(
    private readonly clerkService: ClerkService,
  ) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'aadharCard', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
      { name: 'govEmployeeIdCard', maxCount: 1 },
    ]),
  )
  async createClerk( @Body() createClerkDto: CreateClerkDto, @UploadedFiles() files: {
      aadharCard?: Express.Multer.File[];
      signature?: Express.Multer.File[];
      govEmployeeIdCard?: Express.Multer.File[];
    },
  ) {
    return this.clerkService.createClerk(createClerkDto, {
      aadharCard: files?.aadharCard,
      signature: files?.signature,
      govEmployeeIdCard: files?.govEmployeeIdCard,
    });
  }

  @Get('all')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clerkService.findAll(paginationDto);
  }

}