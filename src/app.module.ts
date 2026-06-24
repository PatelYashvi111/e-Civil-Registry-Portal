import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './module/email/email.module';
import { AadharModule } from './module/aadhar/aadhar.module';
import { AuthModule } from './module/auth/auth.module';
import { SeedModule } from './database/seeds/seed.module';
import { StateModule } from './module/state/state.module';
import { DistrictModule } from './module/district/district.module';
import { OfficeDepartmentModule } from './module/officeDepartment/officeDepartment.module';
import { OfficeModule } from './module/office/office.module';
import { DepartmentModule } from './module/department/department.module';


@Module({
  imports: [   
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath:  '.env.local',
  }),

    MongooseModule.forRoot(process.env.MONGO_URI as string),

    UserModule,
    EmailModule,
    AuthModule,
    AadharModule,
    SeedModule,
    StateModule,
    DistrictModule,
    OfficeDepartmentModule,
    OfficeModule,
    DepartmentModule,

],

  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}

