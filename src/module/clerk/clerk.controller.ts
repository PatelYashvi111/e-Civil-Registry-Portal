import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ClerkService } from './clerk.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { SendClerkInvitationDto } from './dto/send-clerk.invitation';
import { ClerkSetPasswordDto } from './dto/clerk-set-password.dto';

@Controller('clerk')
export class ClerkController {

  constructor(
    private readonly clerkService: ClerkService,
  ) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'aadharCard', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
      { name: 'govEmployeeIdCard', maxCount: 1 },
    ]),
  )
  async createClerk( @Body() createClerkDto: CreateClerkDto, @UploadedFiles() files: {
      aadharCard?: Express.Multer.File[];
      signature?: Express.Multer.File[];
      govEmployeeIdCard?: Express.Multer.File[];
    },
  ) {
    return this.clerkService.createClerk(createClerkDto, {
      aadharCard: files?.aadharCard,
      signature: files?.signature,
      govEmployeeIdCard: files?.govEmployeeIdCard,
    });
  }

  @Post('send-invitation')
  async sendInvitation(
    @Body() sendClerkInvitationDto: SendClerkInvitationDto ) {
    return this.clerkService.sendInvitation(sendClerkInvitationDto);
  }

  @Post('set-password')
  async setPassword( @Body() clerkSetPasswordDto: ClerkSetPasswordDto ) {
    return this.clerkService.setPassword(clerkSetPasswordDto);
  }

}