import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './module/email/email.module';
import { AuthModule } from '../src/module/auth/auth.module';

console.log('MONGO_URI =', process.env.MONGO_URI);

@Module({
  imports: [
   
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.local',
  }),

    MongooseModule.forRoot(process.env.MONGO_URI as string),

    UserModule,
    EmailModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
