import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schema/otp.schema';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [

    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
    ]),
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: '24h' },
    }),
  ],

  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository, MongooseModule],

})

export class OtpModule {}