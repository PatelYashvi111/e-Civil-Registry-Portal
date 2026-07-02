import { Injectable, BadRequestException } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpEnum } from '../../common/enums/otp.enums';
import { Otp } from './schema/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
  ) {}

  // Generate Aadhaar Verification OTP
  async generateAadharVerificationOtp(aadharId: string): Promise<void> {
    // Delete old OTP if exists
    const existingOtp = await this.otpRepository.findOne({
      aadharId,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
    });

    if (existingOtp) {
      await this.otpRepository.deleteOtp(existingOtp._id.toString());
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.createOtp({
      aadharId,
      otpNumber: otp,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log('Aadhaar OTP:', otp);

    // Later replace with:
    // await this.emailService.sendOtp(...);
  }

  // Verify Aadhaar Verification OTP
  async verifyAadharVerificationOtp(
    aadharId: string,
    otp: string,
  ): Promise<void> {
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

    await this.otpRepository.deleteOtp(otpRecord._id.toString());
  }

  // Generate Forgot Password OTP
  async generateForgotPasswordOtp(userId: string): Promise<void> {
    // Delete old OTP if exists
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

    console.log('Forgot Password OTP:', otp);

    // Later replace with:
    // await this.emailService.sendOtp(...);
  }

  // Verify Forgot Password OTP
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

    await this.otpRepository.deleteOtp(otpRecord._id.toString());
  }
}