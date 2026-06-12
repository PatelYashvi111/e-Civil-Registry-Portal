import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
    ){}
    
    async createUser(createUserDto: CreateUserDto) {
  const email = createUserDto.email.toLowerCase();

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
