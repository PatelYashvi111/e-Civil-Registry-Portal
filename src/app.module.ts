import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './module/email/email.module';
import { AuthModule } from './module/auth/auth.module';
import { AadharModule } from './module/aadhar/aadhar.module';
import { BirthModule } from './module/birth/birth.module';
import { MarriageModule } from './module/marriage/marriage.module';
import { DeathModule } from './module/death/death.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { DepartmentModule } from './module/department/department.module';
import { OfficeModule } from './module/office/office.module';
import { OfficeDepartmentModule } from './module/officeDepartment/officeDepartment.module';
import { StateModule } from './module/state/state.module';
import { DistrictModule } from './module/district/district.module';
import { SlotModule } from './module/slot/slot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from './module/application/application.module';
import { OtpModule } from './module/otp/otp.module';

@Module({
  imports: [
   
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath:  '.env.local',
  }),

    ScheduleModule.forRoot(),

    MongooseModule.forRoot(process.env.MONGO_URI as string),

    UserModule,
    EmailModule,
    AuthModule,
    AadharModule,
    BirthModule,
    MarriageModule,
    DeathModule,
    CloudinaryModule,
    OfficeModule,
    DepartmentModule,
    OfficeDepartmentModule,
    StateModule,
    DistrictModule,
    SlotModule,
    ApplicationModule,
    OtpModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
