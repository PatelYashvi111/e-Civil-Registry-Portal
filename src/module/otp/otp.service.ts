import { Injectable, BadRequestException } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpEnum } from '../../common/enums/otp.enums';
import { Otp } from './schema/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
  ) {}

  // Generate OTP for Aadhaar Verification
  async generateAadharVerificationOtp(aadharId: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.createOtp({
      aadharId,
      otpNumber: otp,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    } as Otp);

    console.log('Aadhar OTP:', otp);

    return otp;
  }

  // Verify Aadhaar OTP
  async verifyAadharVerificationOtp(
    aadharId: string,
    otp: string,
  ) {
    const otpRecord = await this.otpRepository.findOne({
      aadharId,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
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

    await this.otpRepository.deleteOtp(
      otpRecord._id.toString(),
    );

    return true;
  }

  // Generate Forgot Password OTP
  async generateForgotPasswordOtp(userId: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.createOtp({
      userId,
      otpNumber: otp,
      serviceType: OtpEnum.FORGOT_PASSWORD,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    } as Otp);

    console.log('Forgot Password OTP:', otp);

    return otp;
  }

  // Verify Forgot Password OTP
  async verifyForgotPasswordOtp(
    userId: string,
    otp: string,
  ) {
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

    await this.otpRepository.deleteOtp(
      otpRecord._id.toString(),
    );

    return true;
  }
}