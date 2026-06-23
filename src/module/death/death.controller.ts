import { Get, Post, Patch, Delete, Body, Controller, Param} from '@nestjs/common';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { DeathService } from './death.service';

@Controller('death')
export class DeathController {

    constructor(
        private readonly deathService: DeathService
    ){}
    
    @Post('create')
    async create( @Body()  createDeathDto: CreateDeathDto ){
        return this.deathService.create( createDeathDto );
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
