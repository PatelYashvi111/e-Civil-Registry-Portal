import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './module/email/email.module';
import { AadharModule } from './module/aadhar/aadhar.module';
import { OfficeModule } from './module/office/office.module';
import { AuthModule } from './module/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ValidationPipe } from '@nestjs/common';
import { DepartmentModule } from './module/department/department.module';
import { DistrictModule } from './module/district/district.module';
import { OfficeDepartmentModule } from './module/officeDepartment/officeDepartment.module'
import { StateModule } from './module/state/state.module';
import { SlotModule } from './module/slot/slot.module';


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
    OfficeModule,
    DepartmentModule,
    DistrictModule,
    OfficeDepartmentModule,
    StateModule,
    SlotModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}

