import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AadharModule } from '../aadhar/aadhar.module';
import { RoleModule } from '../role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema} from '../otp/schema/otp.schema';
import { OtpModule } from '../otp/otp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    AadharModule,
    RoleModule,
    OtpModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: '7d',
    },
  }),
}),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],

})

export class AuthModule {}