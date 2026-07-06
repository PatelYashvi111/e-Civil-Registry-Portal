import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { EmailModule } from '../email/email.module';
import { RoleModule } from '../role/role.module';
import { AadharModule } from '../aadhar/aadhar.module';
import { CounterModule } from '../counter/counter.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';


@Module({
  imports: [
    MongooseModule.forFeature([
        { 
            name: User.name, schema: UserSchema
        }
    ]),
  EmailModule,
  RoleModule,
  AadharModule,
  CounterModule,
  CloudinaryModule,
  ],

  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository,MongooseModule],
})

export class UserModule {}

