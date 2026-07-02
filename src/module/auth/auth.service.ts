import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Aadhar, AadharDocument } from '../aadhar/schema/aadhar.schema';
import { Role, RoleDocument } from '../role/schema/role.schema';
import { OtpEnum } from '../../common/enums/otp.enums';
import { RequestAadharDto } from './dto/request.aadhar.dto';
import { VerifyAadharDto } from './dto/verify.aadhar.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { Otp, OtpDocument } from '../otp/schema/otp.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { VerifyForgotPasswordDto } from './dto/verify.forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { RoleEnum } from 'src/common/enums/role.enums';
import { JwtService } from '@nestjs/jwt';


@Injectable()
 export class AuthService {

  constructor(

  @InjectModel(User.name)
  private readonly userModel: Model<UserDocument>,

  @InjectModel(Otp.name)
  private readonly otpModel: Model<OtpDocument>,

  @InjectModel(Aadhar.name)
  private readonly aadharModel: Model<AadharDocument>,

  @InjectModel(Role.name)
  private readonly roleModel: Model<RoleDocument>,

  private readonly jwtService: JwtService,

 ) {}

  async requestAadhar(requestAadharDto: RequestAadharDto) {
    const { aadharNumber } = requestAadharDto;

    const aadhar = await this.aadharModel.findOne({ aadharNumber });
    
    if (!aadhar) {
      throw new BadRequestException('Aadhar number not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpModel.create({
      
      aadharId: aadhar._id,
      otpNumber: otp,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),

    }); 
   
    console.log("OTP:", otp);

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

    const otpRecord = await this.otpModel.findOne({
      aadharId: aadhar._id,
      serviceType: OtpEnum.AADHAR_VERIFICATION,
    });

    if(!otpRecord) {
      throw new BadRequestException('OTP not found');
    }

    const currentTime = new Date();

    if(currentTime > otpRecord.expiredAt) {
      throw new BadRequestException('OTP expired');
    }
    
    if(otpRecord.otpNumber !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

     await this.otpModel.deleteOne({ _id: otpRecord._id });

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await this.userModel.create({
    roleId: userRole._id,
    aadharId: aadhar._id,
    password: hashedPassword,
  });

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

  const role = await this.roleModel.findById(user.roleId);

  if (!role) {
    throw new BadRequestException('Role not found');
  }

  const payload = {
    userId: user._id,
    email: user.email,
    role: role.name,
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
      role: role.name,
    },
  };
}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if(!user) {
      throw new BadRequestException('User Not Found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpModel.create({
    userId: user._id,
    otpNumber: otp,
    serviceType: OtpEnum.FORGOT_PASSWORD,
    expiredAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  console.log('Reset OTP:', otp);

  return { message: 'OTP sent successfully' };

  }
  
  async verifyForgotPassword(verifyForgotPasswordDto: VerifyForgotPasswordDto) {
    const { email, otp } = verifyForgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if(!user) {
      throw new BadRequestException('User not found');
    }

    const otpRecord = await this.otpModel.findOne({ userId: user._id, serviceType: OtpEnum.FORGOT_PASSWORD})

    if(!otpRecord) {
      throw new BadRequestException('OTP not found');
    } 

    const currentTime = new Date();

    if (currentTime > otpRecord.expiredAt) {
       throw new BadRequestException('OTP expired');
    }

    if(otpRecord.otpNumber !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    return { message: 'OTP verified successfully' }

   }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, password, confirmPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ email });

    if(!user) {
      throw new BadRequestException('User Not Found');
    }

   const otpRecord = await this.otpModel.findOne({ userId: user._id, serviceType: OtpEnum.FORGOT_PASSWORD });

    if(!otpRecord) {
      throw new BadRequestException('OTP Not Found');
    }

    const currentTime = new Date();

    if(currentTime > otpRecord.expiredAt) {
      throw new BadRequestException('OTP expired');
    }

    if(otpRecord.otpNumber !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (password !== confirmPassword) {
       throw new BadRequestException( 'Password and Confirm Password do not match' );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password reset successful' };

  }

 }
