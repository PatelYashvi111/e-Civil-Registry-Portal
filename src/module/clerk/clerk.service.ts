import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClerkRepository } from './clerk.repository';
import { UserRepository } from '../user/user.repository';
import { RoleService } from '../role/role.service';
import { AadharService } from '../aadhar/aadhar.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { EmailService } from '../email/email.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { SendClerkInvitationDto } from '../clerk/dto/send-clerk.invitation';
import { RoleEnum } from 'src/common/enums/role.enums';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class ClerkService {
  constructor(
    private readonly clerkRepository: ClerkRepository,
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly aadharService: AadharService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
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
if (!files.aadharCard?.length) {
  throw new BadRequestException('Aadhar Card is required');
}

if (!files.signature?.length) {
  throw new BadRequestException('Signature is required');
}

if (!files.govEmployeeIdCard?.length) {
  throw new BadRequestException('Government Employee ID Card is required');
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

const aadharCard = aadharUpload.url;
const signature = signatureUpload.url;
const govEmployeeIdCard = govIdUpload.url;
  const clerk = await this.clerkRepository.createClerk(
    {
      ...createClerkDto,
      email,
      aadharCard,
      signature,
      govEmployeeIdCard,
    },
    clerkRole._id.toString(),
  );

  return clerk;
}

  async sendInvitation(dto: SendClerkInvitationDto) {
    const clerk = await this.userRepository.findById(dto.clerkId);

    if (!clerk) {
      throw new NotFoundException('Clerk not found');
    }

    const verificationToken =
      await this.otpService.generateInvitationToken(clerk._id);

    await this.emailService.sendClerkInvitationEmail(
      clerk.email,
      verificationToken,
    );

    return {
      message: 'Invitation sent successfully',
    };
  }
 
}