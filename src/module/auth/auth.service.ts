import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestAadharDto } from './dto/request.aadhar.dto';
import { VerifyAadharDto } from './dto/verify.aadhar.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { VerifyForgotPasswordDto } from './dto/verify.forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

@Injectable()
export class AuthService {

  constructor(

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  
) {}

  async requestAadhar(requestAadharDto: RequestAadharDto) {
    const { aadharNumber } = requestAadharDto;
    return{ message: 'request for Enter Aadhar Number' }
  }

  async verifyAadhar(verifyAadharDto: VerifyAadharDto) {
    const { aadharNumber, otp } = verifyAadharDto;
    return{ message: 'verify Aadhar Number' }
  }

  async register(registerDto: RegisterDto) {
    const { aadharNumber, email, password } = registerDto;
    return { message: 'register successfully' }
  }
  
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    return{ message: 'login successfully' }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    return{ message: 'forgot password successfully' }
  }
  
  async verifyForgotPassword(verifyForgotPasswordDto: VerifyForgotPasswordDto) {
    const { email, otp } = verifyForgotPasswordDto;
    return{ message: 'verify forgot password successfully' }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, password, confirmPassword } = resetPasswordDto;
    return{ message: 'reset password successfully' }
  }

}
