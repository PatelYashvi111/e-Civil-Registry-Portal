import { Module } from "@nestjs/common";
import { InjectModel, MongooseModule } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { User, UserSchema } from "src/module/user/schema/user.schema";
import { Clerk, ClerkSchema } from "./schema/clerk.schema";
import { ClerkRepository } from "./clerk.repository";
import { ClerkService } from "./clerk.service";
import { ClerkController } from "./clerk.controller";
import { UserModule } from "src/module/user/user.module";
import { RoleModule } from "src/module/role/role.module";
import { AadharModule } from "src/module/aadhar/aadhar.module"; 
import { CounterModule } from "src/module/counter/counter.module";
import { CloudinaryModule } from "src/common/cloudinary/cloudinary.module";
import { EmailModule } from "src/module/email/email.module";
import { OtpModule } from "../otp/otp.module";
import { JwtModule } from "@nestjs/jwt";
import { OfficeDepartmentModule } from "../officeDepartment/officeDepartment.module";

@Module({
    imports: [
        JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Clerk.name, schema: ClerkSchema }
        ]),
        UserModule,
        RoleModule,
        AadharModule,
        CounterModule,
        CloudinaryModule,
        OfficeDepartmentModule,
        EmailModule,
        OtpModule,
    ],

    controllers: [ClerkController],
    providers: [ClerkService, ClerkRepository],
    exports: [ClerkService, ClerkRepository, MongooseModule],

})

export class ClerkModule {}
