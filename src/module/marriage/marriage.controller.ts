import { Get, Post, Patch, Delete, Body, Controller, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CreateMarriageDto } from './dto/create-marriage.dto';
import { UpdateMarriageDto } from './dto/update-marriage.dto';
import { MarriageService } from './marriage.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('marriage')
export class MarriageController {

    constructor(
        private readonly marriageService: MarriageService
    ){}
    
    @Post('create')
    @UseInterceptors(
    FileFieldsInterceptor([
        { name: 'brideAadharCard', maxCount: 1 },
        { name: 'groomAadharCard', maxCount: 1 },
        { name: 'witnessAadharCard', maxCount: 1 },
        { name: 'brahmanAadharCard', maxCount: 1 },
        { name: 'brideRationCard', maxCount: 1 },
        { name: 'groomRationCard', maxCount: 1 },
        { name: 'bridePhoto', maxCount: 1 },
        { name: 'groomPhoto', maxCount: 1 },
        { name: 'invitationCard', maxCount: 1 },
        
    ])
    )
    async create( @Body()  createMarriageDto: CreateMarriageDto, @UploadedFiles() files: any){
        return this.marriageService.create( createMarriageDto, files);
    }

    @Get('all')
    async findAll(){
        return this.marriageService.findAll();
    }

    @Get(':id')
        async findById( @Param('id') id: string ){
        return this.marriageService.findById( id );
    }

    @Patch(':id')
    async updateUser( @Param('id') id: string, @Body() updateMarriageDto: UpdateMarriageDto){
        return this.marriageService.update( id, updateMarriageDto );
    }

    @Delete(':id')
    async deleteUser( @Param('id') id: string ){
        return this.marriageService.delete( id );
    }

}
