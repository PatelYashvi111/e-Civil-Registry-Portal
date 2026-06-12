import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService{

    constructor(
        private userRepository: UserRepository
    ){}

    async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.userRepository.createUser(createUserDto);
  }

    async findByEmail( email: string ){
        return this.userRepository.findByEmail( email );
    }

    async findById( id: string ){
        return this.userRepository.findById( id );
    }

    async findAll(){
        return this.userRepository.findAll();
    }

    async updateUser( id: string, updateUserDto: UpdateUserDto ){
        return this.userRepository.updateUser( id, updateUserDto );
    }

    async deleteUser( id: string ){
        return this.userRepository.deleteUser( id );
    }
    
}
