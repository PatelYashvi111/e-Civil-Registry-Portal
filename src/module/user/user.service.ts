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
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class UserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService,
        private readonly roleService: RoleService,
        private readonly aadharService: AadharService,
        private readonly counterService: CounterService,
        private readonly cloudinaryService: CloudinaryService,
    ){}
    
  async createUser(createUserDto: CreateUserDto, files: {
    aadharCard?: Express.Multer.File[];
  }) {
    const email = createUserDto.email.toLowerCase();

    const role =await this.roleService.findById(createUserDto.roleId);
    if(role.name !== RoleEnum.USER ) {
      throw new BadRequestException('Only USER is allowed');
    }

    await this.aadharService.findById(createUserDto.aadharId);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
        throw new BadRequestException('Email already exists');
    }

    const aadharCardFile = files.aadharCard?.[0];

    let aadharCard: string | undefined;

    if (aadharCardFile) {
      const uploaded = await this.cloudinaryService.uploadFile(
        aadharCardFile,
        'user/aadhar-card',
      );

      aadharCard = uploaded.url;
    }

    const user = await this.userRepository.createUser({
      ...createUserDto,
      email,
      aadharCard,
    });

    await this.emailService.sendWelcomeEmail(user.email , 'User');

    return user;
    }

  async findById( id: string ){
     const user = await this.userRepository.findById( id );

     if(!user) {
        throw new NotFoundException('User not found');
     }   

    return user;

    }

  async findAll(paginationDto: PaginationDto) {
        const { page=1, limit=10, search } = paginationDto;

        const skip = (page - 1) * limit;

        const userRole = await this.roleService.findByName(RoleEnum.USER);


        return this.userRepository.findAll(userRole._id.toString(), skip, limit, page, search);
    }

  async updateUser( id: string, updateUserDto: UpdateUserDto ){
        const user= await this.userRepository.findById( id );

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return this.userRepository.updateUser( id, updateUserDto );
        
    }

  async deleteUser( id: string ){
        return this.userRepository.deleteUser( id );
    }
    
}
