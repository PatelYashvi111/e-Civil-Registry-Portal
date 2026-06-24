import { Get, Post, Patch, Delete, Body, Controller, Param} from '@nestjs/common';
import { CreateMarriageDto } from './dto/create-marriage.dto';
import { UpdateMarriageDto } from './dto/update-marriage.dto';
import { MarriageService } from './marriage.service';

@Controller('marriage')
export class MarriageController {

    constructor(
        private readonly marriageService: MarriageService
    ){}
    
    @Post('create')
    async create( @Body()  createMarriageDto: CreateMarriageDto ){
        return this.marriageService.create( createMarriageDto );
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
