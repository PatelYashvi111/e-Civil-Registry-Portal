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
    signature?: Express.Multer.File[];
    govEmployeeIdCard?: Express.Multer.File[];
  }) {
    const email = createUserDto.email.toLowerCase();

    const role =await this.roleService.findById(createUserDto.roleId);

    await this.aadharService.findById(createUserDto.aadharId);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
        throw new BadRequestException('Email already exists');
    }

    let employeeId: string | undefined;

    if( role.name === RoleEnum.CLERK || role.name === RoleEnum.ADMIN) {
      createUserDto.employeeId = await this.counterService.generateEmployeeId();
    }

    const aadharCardFile = files.aadharCard?.[0];
    const signatureFile = files.signature?.[0];
    const govEmployeeIdCardFile = files.govEmployeeIdCard?.[0];

    let aadharCard: string | undefined;
    let signature: string | undefined;
    let govEmployeeIdCard: string | undefined;

    if (aadharCardFile) {
      const uploaded = await this.cloudinaryService.uploadFile(
        aadharCardFile,
        'user/aadhar-card',
      );

      aadharCard = uploaded.url;
    }

    if (signatureFile) {
      const uploaded = await this.cloudinaryService.uploadFile(
        signatureFile,
        'user/signature',
      );

      signature = uploaded.url;
    }

    if (govEmployeeIdCardFile) {
      const uploaded = await this.cloudinaryService.uploadFile(
        govEmployeeIdCardFile,
        'user/gov-employee-id-card',
      );

      govEmployeeIdCard = uploaded.url;
    }


    const user = await this.userRepository.createUser({
      ...createUserDto,
      email,
      employeeId,
      aadharCard,
      signature,
      govEmployeeIdCard,
    });

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

  async findAll(paginationDto: PaginationDto) {
        const { page=1, limit=10 } = paginationDto;

        const skip = (page - 1) * limit;

        return this.userRepository.findAll(skip, limit, page);
    }

  async updateUser( id: string, updateUserDto: UpdateUserDto ){
        return this.userRepository.updateUser( id, updateUserDto );
        
    }

  async deleteUser( id: string ){
        return this.userRepository.deleteUser( id );
    }
    
}
