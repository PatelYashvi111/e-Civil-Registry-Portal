import { Post, Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestAadharDto } from './dto/request.aadhar.dto';
import { VerifyAadharDto } from './dto/verify.aadhar.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { VerifyForgotPasswordDto } from './dto/verify.forgot.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
) {}

  @Post('request-aadhar')
  async requestAadhar( @Body() requestAadharDto: RequestAadharDto ) {
    return this.authService.requestAadhar( requestAadharDto );
  }

  @Post('verify-aadhar')
  async verifyAadhar( @Body() verifyAadharDto: VerifyAadharDto ) {
    return this.authService.verifyAadhar( verifyAadharDto );
  }

  @Post('register')
  async register( @Body() registerDto: RegisterDto ) {
    return this.authService.register( registerDto );
  }

  @Post('login')
  async login( @Body() loginDto: LoginDto ) {
    return this.authService.login( loginDto )
  }
  
  @Post('forgot-password')
  async forgotPassword( @Body() forgotPasswordDto: ForgotPasswordDto ) {
    return this.authService.forgotPassword( forgotPasswordDto );
  }

  @Post('verify-forgot-password')
  async verifyForgotPassword( @Body() verifyForgotPassword: VerifyForgotPasswordDto ) {
    return this.authService.verifyForgotPassword( verifyForgotPassword );
  }

  @Post('reset-password')
  async resetPassword( @Body() resetPasswordDto: ResetPasswordDto ) {
    return this.authService.resetPassword( resetPasswordDto );
  }

}