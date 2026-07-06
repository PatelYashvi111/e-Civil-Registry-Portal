import { Get, Post, Patch, Delete, Body, Controller, Param, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}
    

    @Post('create')
    @UseInterceptors(
    FileFieldsInterceptor([
    { name: 'aadharCard', maxCount: 1 },
    ]))
    async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: {
        aadharCard?: Express.Multer.File[];
    },
    ) {
    return this.userService.createUser(createUserDto,{
        aadharCard: files?.aadharCard,
    });
    }

    @Get('all')
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.userService.findAll(paginationDto);
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
