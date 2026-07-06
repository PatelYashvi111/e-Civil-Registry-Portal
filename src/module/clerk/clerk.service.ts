// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { ClerkRepository } from './clerk.repository';
// import { UserRepository } from '../user/user.repository';
// import { RoleService } from '../role/role.service';
// import { AadharService } from '../aadhar/aadhar.service';
// import { CounterService } from '../counter/counter.service';
// import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
// import { EmailService } from '../email/email.service';
// import { CreateClerkDto } from './dto/create-clerk.dto';
// import { SendClerkInvitationDto } from '../clerk/dto/send-clerk.invitation';
// import { ClerkSetPasswordDto } from './dto/clerk-set-password.dto';
// import { RoleEnum } from 'src/common/enums/role.enums';
// import { OtpService } from '../otp/otp.service';

// @Injectable()
// export class ClerkService {
//   constructor(
//     private readonly clerkRepository: ClerkRepository,
//     private readonly userRepository: UserRepository,
//     private readonly roleService: RoleService,
//     private readonly aadharService: AadharService,
//     private readonly counterService: CounterService,
//     private readonly cloudinaryService: CloudinaryService,
//     private readonly emailService: EmailService,
//     private readonly otpService: OtpService,
//   ) {}

//   async createClerk(
//     createClerkDto: CreateClerkDto,
//     files: {
//       aadharCard?: Express.Multer.File[];
//       signature?: Express.Multer.File[];
//       govEmployeeIdCard?: Express.Multer.File[];
//     },
//   ) {
//     const email = createClerkDto.email.toLowerCase();

//     const existingUser = await this.userRepository.findByEmail(email);

//     if (existingUser) {
//       throw new BadRequestException('Email already exists');
//     }

//     await this.aadharService.findById(createClerkDto.aadharId);

//     const clerkRole = await this.roleService.findByName(RoleEnum.CLERK);

//     if (!clerkRole) {
//       throw new BadRequestException('Clerk role not found');
//     }

//     const employeeId = await this.counterService.generateEmployeeId();

//     let aadharCard: string | undefined;
//     let signature: string | undefined;
//     let govEmployeeIdCard: string | undefined;

//     if (files.aadharCard?.length) {
//       const uploaded = await this.cloudinaryService.uploadFile(
//         files.aadharCard[0],
//         'clerk/aadhar-card',
//       );
//       aadharCard = uploaded.url;
//     }

//     if (files.signature?.length) {
//       const uploaded = await this.cloudinaryService.uploadFile(
//         files.signature[0],
//         'clerk/signature',
//       );
//       signature = uploaded.url;
//     }

//     if (files.govEmployeeIdCard?.length) {
//       const uploaded = await this.cloudinaryService.uploadFile(
//         files.govEmployeeIdCard[0],
//         'clerk/gov-id-card',
//       );
//       govEmployeeIdCard = uploaded.url;
//     }

//     const clerk = await this.clerkRepository.createClerk({
//       ...createClerkDto,
//       email,
//       roleId: clerkRole._id.toString(),
//       employeeId,
//       aadharCard,
//       signature,
//       govEmployeeIdCard,
//     });

//     return clerk;
//   }

//   async sendInvitation(dto: SendClerkInvitationDto) {
//     const clerk = await this.userRepository.findById(dto.clerkId);

//     if (!clerk) {
//       throw new NotFoundException('Clerk not found');
//     }

//     const verificationToken =
//       await this.otpService.generateInvitationToken(clerk._id);

//     await this.emailService.sendClerkInvitationEmail(
//       clerk.email,
//       verificationToken,
//     );

//     return {
//       message: 'Invitation sent successfully',
//     };
//   }
 
//   async setPassword(clerkSetPasswordDto: ClerkSetPasswordDto) {
//   const { verificationToken, password, confirmPassword } = clerkSetPasswordDto;

//   if (password !== confirmPassword) {
//     throw new BadRequestException(
//       'Password and Confirm Password do not match',
//     );
//   }

//   const token = await this.otpService.verifyInvitationToken(
//     verificationToken,
//   );

//   if (!token) {
//     throw new BadRequestException(
//       'Invalid or expired verification token',
//     );
//   }

//   const clerk = await this.userRepository.findById(
//     token.userId.toString(),
//   );

//   if (!clerk) {
//     throw new NotFoundException('Clerk not found');
//   }

//   if (clerk.password) {
//     throw new BadRequestException(
//       'Password has already been set',
//     );
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   await this.userRepository.updateUser(clerk._id.toString(), {
//     password: hashedPassword,
//   });

//   await this.otpService.markInvitationAsUsed(
//     verificationToken,
//   );

//   return {
//     message: 'Password set successfully',
//   };
// }
// }