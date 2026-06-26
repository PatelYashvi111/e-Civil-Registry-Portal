import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'
import { EmailService } from 'src/module/email/email.service';
import { RoleService } from '../role/role.service';
import { AadharService } from '../aadhar/aadhar.service';

@Injectable()
export class UserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
        private readonly roleService: RoleService,
        private readonly aadharService: AadharService
    ){}
    
  async createUser(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase();

    await this.roleService.findById(createUserDto.roleId);

    await this.aadharService.findById(createUserDto.aadharId);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
        throw new BadRequestException('Email already exists');
    }

    const user = await this.userRepository.createUser({ ...createUserDto, email });

    await this.emailService.sendWelcomeEmail(user.email , 'User');

    return user;
    }

  async findByEmail( email: string ){
        return this.userRepository.findByEmail( email );
    }

  async findById( id: string ){
     const user = await this.userRepository.findById( id );

     if(!user) {
        throw new NotFoundException('User not found');
     }   

    return user;

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
