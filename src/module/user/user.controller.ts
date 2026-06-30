import { Get, Post, Patch, Delete, Body, Controller, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}
    

    @Post('create')
    @UseInterceptors(
    FileFieldsInterceptor([
    { name: 'aadharCard', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'govEmployeeIdCard', maxCount: 1 },
    ]))
    async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: {
        aadharCard?: Express.Multer.File[];
        signature?: Express.Multer.File[];
        govEmployeeIdCard?: Express.Multer.File[];
    },
    ) {
    return this.userService.createUser(createUserDto,{
        aadharCard: files?.aadharCard,
        signature: files?.signature,
        govEmployeeIdCard: files?.govEmployeeIdCard
    });
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
