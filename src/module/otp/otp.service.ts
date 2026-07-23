import { Injectable, BadRequestException } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpEnum } from '../../common/enums/otp.enums';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { EmailService } from 'src/module/email/email.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAadharVerificationOtp(aadharId: string,email: string,name: string): Promise<void> {
    const existingOtp = await this.otpRepository.findOne({
      aadharId,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
    });

    if (existingOtp) {
      await this.otpRepository.deleteOtp(existingOtp._id.toString());
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const createdOtp = await this.otpRepository.createOtp({
      aadharId,
      otpNumber: otp,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log('Created OTP:', createdOtp.otpNumber);
console.log('Created ExpiredAt:', createdOtp.expiredAt);
   
    await this.emailService.sendOtpEmail(email,name,otp,'Generate OTP');
        console.log(`Generate OTP for Aadhar generation: ${otp}`);

  }

  async verifyAadharVerificationOtp( aadharId: string, otp: string, email: string, name: string ): Promise<void> {
    const otpRecord = await this.otpRepository.findOne({
      aadharId,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
    });

    if (!otpRecord) {
      throw new BadRequestException('OTP not found');
    }

    console.log('Current Time :', new Date().toISOString());
  console.log('OTP ExpiredAt:', otpRecord.expiredAt);
  console.log('OTP ExpiredAt ISO:', otpRecord.expiredAt.toISOString());

    if (new Date() > otpRecord.expiredAt) {
      throw new BadRequestException('OTP expired');
    }

    if (otpRecord.otpNumber !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpRepository.deleteOtp(otpRecord._id.toString());
        await this.emailService.sendOtpEmail(email,name,otp,'Verify Generate OTP');
   
    console.log(`Verified OTP for Aadhar verification: ${otp}`);
  }

  async generateForgotPasswordOtp(userId: string, email: string, name: string): Promise<void> {
    const existingOtp = await this.otpRepository.findOne({
      userId,
      serviceType: OtpEnum.FORGOT_PASSWORD,
    });

    if (existingOtp) {
      await this.otpRepository.deleteOtp(existingOtp._id.toString());
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.createOtp({
      userId,
      otpNumber: otp,
      serviceType: OtpEnum.FORGOT_PASSWORD,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.emailService.sendOtpEmail(email,name,otp,'Generate Forgot Password OTP');
    console.log(`Generated OTP for forgot password: ${otp}`);
  }

async verifyForgotPasswordOtp(
  userId: string,
  otp: string,
): Promise<void> {

  const otpRecord = await this.otpRepository.findOne({
    userId,
    serviceType: OtpEnum.FORGOT_PASSWORD,
  });


  if (!otpRecord) {
    throw new BadRequestException('OTP not found');
  }


  if (new Date() > otpRecord.expiredAt) {
    throw new BadRequestException('OTP expired');
  }


  if (otpRecord.otpNumber !== otp) {
    throw new BadRequestException('Invalid OTP');
  }


  await this.otpRepository.markOtpVerified(
    otpRecord._id.toString(),
  );


  console.log(`Verified Forgot Password OTP: ${otp}`);
}

  async checkForgotPasswordOtpVerified(
  userId: string,
): Promise<boolean> {

  const otpRecord = await this.otpRepository.findOne({
    userId,
    serviceType: OtpEnum.FORGOT_PASSWORD,
  });

  if (!otpRecord) {
    return false;
  }

  return otpRecord.isVerified === true;
}

async deleteForgotPasswordOtp(
  userId: string,
): Promise<void> {

  const otpRecord = await this.otpRepository.findOne({
    userId,
    serviceType: OtpEnum.FORGOT_PASSWORD,
  });

  if (otpRecord) {
    await this.otpRepository.deleteOtp(
      otpRecord._id.toString(),
    );
  }
}

async generateResetToken(
  userId: string,
): Promise<string> {
  return this.jwtService.sign(
    {
      userId,
      purpose: 'reset_password',
    },
    {
      expiresIn: '10m',
    },
  );
}

async verifyResetToken(
  resetToken: string,
): Promise<any> {
  try {
    const payload = this.jwtService.verify(resetToken);

    if (payload.purpose !== 'reset_password') {
      throw new BadRequestException(
        'Invalid token purpose',
      );
    }

    return payload;
  } catch {
    throw new BadRequestException(
      'Invalid or expired reset token',
    );
  }
}

  async generateInvitationToken(userId: string): Promise<string> {
  return this.jwtService.sign(
    {
      userId,
      purpose: 'clerk_invitation',
    },
    {
      expiresIn: '24h',
    },
  );
}

async verifyInvitationToken(token: string): Promise<any> {
  try {
    const payload = this.jwtService.verify(token);

    if (payload.purpose !== 'clerk_invitation') {
      throw new BadRequestException('Invalid token purpose');
    }

    return payload;
  } catch {
    throw new BadRequestException(
      'Invalid or expired verification token',
    );
  }

}
}