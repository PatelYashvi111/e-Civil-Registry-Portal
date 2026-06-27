import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'
import { EmailService } from 'src/module/email/email.service';
import { RoleService } from '../role/role.service';
import { AadharService } from '../aadhar/aadhar.service';
import { CounterService } from '../counter/counter.service';
import { RoleEnum } from 'src/common/enums/role.enums';

@Injectable()
export class UserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
        private readonly roleService: RoleService,
        private readonly aadharService: AadharService,
        private readonly counterService: CounterService,
    ){}
    
  async createUser(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const email = createUserDto.email.toLowerCase();

    const role =await this.roleService.findById(createUserDto.roleId);

    await this.aadharService.findById(createUserDto.aadharId);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
        throw new BadRequestException('Email already exists');
    }

    let employeeId: string | null = null;

    if( role.name === RoleEnum.CLERK || role.name === RoleEnum.ADMIN) {
      createUserDto.employeeId = await this.counterService.generateEmployeeId();
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
