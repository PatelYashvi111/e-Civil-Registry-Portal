import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RequestAadharDto } from './dto/request.aadhar.dto';
import { VerifyAadharDto } from './dto/verify.aadhar.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { Otp, OtpDocument } from '../otp/schema/otp.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { VerifyForgotPasswordDto } from './dto/verify.forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

@Injectable()
export class AuthService {

  constructor(

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly otpModel: Model<OtpDocument>
  
) {}

  async requestAadhar(requestAadharDto: RequestAadharDto) {
    const { aadharNumber } = requestAadharDto;

    if(!aadharNumber{
      throw new BadRequestException('Aadhar number is required'); 
    })

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

   await this.otpModel.create({
      aadharNumber,
      otp,
      type: 'AADHAR',
      isVerified: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }); 
   
    console.log("OTP:", otp);

    return { message: "OTP sent successfully" };
}

  async verifyAadhar(verifyAadharDto: VerifyAadharDto) {
    const { aadharNumber, otp } = verifyAadharDto;

    return{ message: 'Aadhar verification successful'}
    
  }

  async register(registerDto: RegisterDto) {
    const { aadharNumber, password } = registerDto;

     const otpVerified = await this.otpModel.findOne({ aadharNumber });

    if (!otpVerified) throw new BadRequestException('Aadhaar not verified');

    const exists = await this.userModel.findOne({ aadharNumber });
    if (exists) throw new BadRequestException('User exists');

    const user = await this.userModel.create({ aadharNumber, password: await bcrypt.hash(password, 10)});

    return { message: 'Registered', userId: user._id };
  }
  
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

  }
  
  async verifyForgotPassword(verifyForgotPasswordDto: VerifyForgotPasswordDto) {
    const { email, otp } = verifyForgotPasswordDto;

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, password, confirmPassword } = resetPasswordDto;

  }

}
