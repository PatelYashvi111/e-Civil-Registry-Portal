import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schema/otp.schema';
//import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';


@Module({
  imports: [

    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],

  providers: [ OtpRepository],
  exports: [ OtpRepository, MongooseModule],

})

export class OtpModule {}