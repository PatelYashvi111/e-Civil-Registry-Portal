import { Get, Post, Patch, Delete, Body, Controller, Param} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}
    
    @Post('create')
    async createUser( @Body()  createUserDto: CreateUserDto ){
        return this.userService.createUser( createUserDto );
    }

    @Get('all')
    async findAll(){
        return this.userService.findAll();
    }

    @Get(':id')
        async findById( @Param('id') id: string ){
        return this.userService.findById( id );
    }

    @Patch(':id')
    async updateUser( @Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return this.userService.updateUser( id, updateUserDto );
    }

    @Delete(':id')
    async deleteUser( @Param('id') id: string ){
        return this.userService.deleteUser( id );
    }

}
