import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Aadhar, AadharDocument } from '../aadhar/schema/aadhar.schema';
import { Role, RoleDocument } from '../role/schema/role.schema';
import { RequestAadharDto } from './dto/request.aadhar.dto';
import { VerifyAadharDto } from './dto/verify.aadhar.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { VerifyForgotPasswordDto } from './dto/verify.forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { RoleEnum } from 'src/common/enums/role.enums';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {

  constructor(

  @InjectModel(User.name)
  private readonly userModel: Model<UserDocument>,

  @InjectModel(Aadhar.name)
  private readonly aadharModel: Model<AadharDocument>,

  @InjectModel(Role.name)
  private readonly roleModel: Model<RoleDocument>,

  private readonly jwtService: JwtService,

  private readonly otpService: OtpService,

 ) {}

  async requestAadhar(requestAadharDto: RequestAadharDto) {
    const { aadharNumber } = requestAadharDto;

    const aadhar = await this.aadharModel.findOne({ aadharNumber });
    
    if (!aadhar) {
      throw new BadRequestException('Aadhar number not found');
    }

    await this.otpService.generateAadharVerificationOtp(aadhar._id.toString(),aadhar.email,`${aadhar.firstName} ${aadhar.lastName}`);

    const verificationToken = this.jwtService.sign(
   {
    aadharId: aadhar._id,
    purpose: 'registration',
   },
  );

  return {
    message: 'Aadhar verification successful',
    verificationToken,
  };
}

  async verifyAadhar(verifyAadharDto: VerifyAadharDto) {
   
    const { aadharNumber, otp } = verifyAadharDto;

    const aadhar = await this.aadharModel.findOne({ aadharNumber });

    if (!aadhar) {  
      throw new BadRequestException('Aadhar number not found');
    }

    await this.otpService.verifyAadharVerificationOtp(aadhar._id.toString(), otp, aadhar.email,`${aadhar.firstName} ${aadhar.lastName}`);
    return{
       message: 'Aadhar verification successful'
    }
    
  }

  async register(registerDto: RegisterDto) {
  const { password, verificationToken } = registerDto;

  let payload;

  try {
    payload = this.jwtService.verify(verificationToken);
  } catch {
    throw new BadRequestException('Invalid or expired verification token');
  }

  if (payload.purpose !== 'registration') {
    throw new BadRequestException('Invalid token purpose');
  }

  const aadhar = await this.aadharModel.findById(payload.aadharId);

  if (!aadhar) {
    throw new BadRequestException('Aadhar number not found');
  }

  const existingUser = await this.userModel.findOne({
    aadharId: aadhar._id,
  });

  if (existingUser) {
    throw new BadRequestException('User already exists');
  }

  const userRole = await this.roleModel.findOne({
    name: RoleEnum.USER,
  });

  if (!userRole) {
    throw new BadRequestException('User role not found');
  }

  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  const user = await this.userModel.create({
    roleId: userRole._id,
    aadharId: aadhar._id,
    email: aadhar.email,
    password: hashedPassword,
  });

  console.log('Saved Password:', user.password);
  return {
    message: 'Registered successfully',
    userId: user._id,
  };
}

async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const user = await this.userModel.findOne({
    email: email.toLowerCase() });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequestException('Invalid password');
  }

  const payload = {
    userId: user._id,
    email: user.email,
    roleId: user.roleId,
  };

  const accessToken = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  return {
    message: 'Login successful',
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      roleId: user.roleId,
    },
  };
}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if(!user) {
      throw new BadRequestException('User Not Found');
    }

    const aadhar = await this.aadharModel.findById(user.aadharId);

    if(!aadhar) {
      throw new BadRequestException('Aadhar Not Found');
    }

    await this.otpService.generateForgotPasswordOtp(user._id.toString(), aadhar.email,`${aadhar.firstName} ${aadhar.lastName}`);

    return { message: 'OTP sent successfully' };

  }
  
  async verifyForgotPassword(verifyForgotPasswordDto: VerifyForgotPasswordDto) {
    const { email, otp } = verifyForgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if(!user) {
      throw new BadRequestException('User not found');
    }

    const aadhar = await this.aadharModel.findById(user.aadharId);

    if(!aadhar) {
      throw new BadRequestException('Aadhar not found');
    }

    await this.otpService.verifyForgotPasswordOtp( user._id.toString(), otp, aadhar.email,`${aadhar.firstName} ${aadhar.lastName}`);

    return { message: 'OTP verified successfully' }

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, password, confirmPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ email });

    if(!user) {
      throw new BadRequestException('User Not Found');
    }

    const aadhar = await this.aadharModel.findById(user.aadharId);

    if(!aadhar) {
      throw new BadRequestException('Aadhar Not Found');
    }

    await this.otpService.verifyForgotPasswordOtp( user._id.toString(), otp, aadhar.email,`${aadhar.firstName} ${aadhar.lastName}`)
  
    if (password !== confirmPassword) {
       throw new BadRequestException( 'Password and Confirm Password do not match' );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password reset successful' };

  }

}
