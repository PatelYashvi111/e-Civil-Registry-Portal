import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClerkRepository } from './clerk.repository';
import { UserRepository } from '../user/user.repository';
import { RoleService } from '../role/role.service';
import { AadharService } from '../aadhar/aadhar.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { RoleEnum } from 'src/common/enums/role.enums';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class ClerkService {
  constructor(
    private readonly clerkRepository: ClerkRepository,
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly aadharService: AadharService,
    private readonly cloudinaryService: CloudinaryService,

  ) {}

  async createClerk(
  createClerkDto: CreateClerkDto,
  files: {
    aadharCard?: Express.Multer.File[];
    signature?: Express.Multer.File[];
    govEmployeeIdCard?: Express.Multer.File[];
  },
) {
  const email = createClerkDto.email.toLowerCase();

  const existingUser = await this.userRepository.findByEmail(email);

  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  const existingEmployee = await this.clerkRepository.findByEmployeeId(
    createClerkDto.employeeId,
  );

  if (existingEmployee) {
    throw new BadRequestException('Employee ID already exists');
  }

  const aadhar = await this.aadharService.findById(createClerkDto.aadharId);

  if (!aadhar) {
    throw new NotFoundException('Aadhar not found');
  }

  const clerkRole = await this.roleService.findByName(RoleEnum.CLERK);

  if (!clerkRole) {
    throw new BadRequestException('Clerk role not found');
  }

  if (!files.aadharCard?.length || !files.signature?.length || !files.govEmployeeIdCard?.length) {
    throw new BadRequestException('All documents are required');
  }

  const aadharUpload = await this.cloudinaryService.uploadFile(
    files.aadharCard[0],
    'clerk/aadhar-card',
  );

  const signatureUpload = await this.cloudinaryService.uploadFile(
    files.signature[0],
    'clerk/signature',
  );

  const govIdUpload = await this.cloudinaryService.uploadFile(
    files.govEmployeeIdCard[0],
    'clerk/gov-id-card',
  );

  return this.clerkRepository.createClerk(
    {
      ...createClerkDto,
      email,
      aadharCard: aadharUpload.url,
      signature: signatureUpload.url,
      govEmployeeIdCard: govIdUpload.url,
    },
    clerkRole._id.toString(),
  );
}

   async findAll(paginationDto: PaginationDto) {
    const {page=1, limit=10} = paginationDto;
    const skip = (page - 1) * limit;
    const clerkRole = await this.roleService.findByName(RoleEnum.CLERK);
    return await this.clerkRepository.findAllClerks(clerkRole._id.toString(), skip, limit, page);
  }

 
}