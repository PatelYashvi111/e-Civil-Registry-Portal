import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './module/email/email.module';
import { AadharModule } from './module/aadhar/aadhar.module';
import { AuthModule } from '../src/module/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ValidationPipe } from '@nestjs/common';

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
  ],

  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}

