import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClerkRepository } from './clerk.repository';
import { UserRepository } from '../user/user.repository';
import { RoleService } from '../role/role.service';
import { AadharService } from '../aadhar/aadhar.service';
import { AadharRepository } from '../aadhar/aadhar.repository';
import { OfficeDepartmentService } from '../officeDepartment/officeDepartment.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { UpdateClerkDto } from './dto/update-clerk.dto';
import { ClerkStatusEnum } from 'src/common/enums/clerk.status.enums';
import { RoleEnum } from 'src/common/enums/role.enums';
import { VerifyAadharDto } from '../auth/dto/verify.aadhar.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class ClerkService {
  constructor(
    private readonly clerkRepository: ClerkRepository,
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly aadharService: AadharService,
    private readonly officeDepartmentService: OfficeDepartmentService,
    private readonly aadharRepository: AadharRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
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

    if (!createClerkDto.verificationToken) {
    throw new BadRequestException('Verification token is required');
  }

    const payload = this.jwtService.verify(createClerkDto.verificationToken);

  if (payload.purpose !== 'registration') {
    throw new BadRequestException('Invalid token');
  }

    let aadhar;

    if (Types.ObjectId.isValid(createClerkDto.aadharId)) {
      aadhar = await this.aadharService.findById(createClerkDto.aadharId);
    } else {
      aadhar = await this.aadharService.findByAadharNumber(createClerkDto.aadharId);
    }

    if (!aadhar) {
      throw new NotFoundException('Aadhar not found');
    }

    let officeDepartment;

        if (Types.ObjectId.isValid(createClerkDto.officeDepartmentId)) {
        officeDepartment = await this.officeDepartmentService.findById(
            createClerkDto.officeDepartmentId,
        );
        } else {
        officeDepartment = await this.officeDepartmentService.findByName(
            createClerkDto.officeDepartmentId,
        );
        }

        if (!officeDepartment) {
        throw new NotFoundException('Office Department not found');
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
      aadharId: aadhar._id.toString(),
      email,
      password: await bcrypt.hash(createClerkDto.password, 10),
      aadharCard: aadharUpload.url,
      signature: signatureUpload.url,
      govEmployeeIdCard: govIdUpload.url,
    },
    clerkRole._id.toString(),
  );
}

   async findAll(paginationDto: PaginationDto) {
    const {page=1, limit=10, search} = paginationDto;
    const skip = (page - 1) * limit;
    const clerkRole = await this.roleService.findByName(RoleEnum.CLERK);
    return await this.clerkRepository.findAllClerks(clerkRole._id.toString(), skip, limit, page, search);
  }
 
  async findById(id: string) {
    const clerk = await this.clerkRepository.findById(id);

    if (!clerk) {
      throw new NotFoundException('Clerk not found');
    }

    return clerk;
  
  }

  async assignClerk(officeDepartmentId:string){
    const clerkRole = await this.roleService.findByName(RoleEnum.CLERK);

    if(!clerkRole){
        throw new NotFoundException("Clerk role not found");
    }

    const clerk = await this.clerkRepository.findAvailableClerk( officeDepartmentId, clerkRole._id.toString() );

    if(!clerk){
        throw new NotFoundException("No clerk available");
    }

    return clerk;
    }

  async increaseWorkload(clerkId:string){
    return await this.clerkRepository.incrementAssignedApplicationCount(clerkId);
  }

  async updateClerk( id: string, updateClerkDto: UpdateClerkDto ) {
    const existingClerk = await this.clerkRepository.findById(id);

    if (!existingClerk) {
      throw new NotFoundException('Clerk not found');
    }

    if (updateClerkDto.officeDepartmentId) {
      const officeDepartment = await this.clerkRepository.findByOfficeDepartmentId( updateClerkDto.officeDepartmentId );

      if (!officeDepartment.length) {
        throw new BadRequestException('Office  not found');
      }
    }

    if (updateClerkDto.password) {
      updateClerkDto.password = await bcrypt.hash( updateClerkDto.password, 10 );
    }
    
    const updatedClerk = await this.clerkRepository.update( id, updateClerkDto );

    return updatedClerk;
  }

    async deleteClerk(id: string) {
      const clerk = await this.clerkRepository.delete(id)

      if(!clerk) {
        throw new BadRequestException('Clerk Not Found');
      }

      return clerk;

      }

}