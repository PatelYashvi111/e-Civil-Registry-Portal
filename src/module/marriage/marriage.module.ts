import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MarriageRepository } from "./marriage.repository";
import { MarriageService } from "./marriage.service";
import { MarriageController } from "./marriage.controller";
import { Marriage, MarriageSchema } from "./schema/marriage.schema";
import { AadharModule } from "../aadhar/aadhar.module";
import { SlotModule } from "../slot/slot.module"
import { CloudinaryModule } from "../../common/cloudinary/cloudinary.module";
import { CounterModule } from "../counter/counter.module";
import { JwtModule } from "@nestjs/jwt";
import { OfficeDepartmentModule } from "../officeDepartment/officeDepartment.module";
import { ApplicationModule } from "../application/application.module";

@Module({
    imports: [
        JwtModule.register({
       secret: process.env.JWT_SECRET,
       signOptions: {
         expiresIn: '1d',
       },
     }),
     
        MongooseModule.forFeature([
            {
                name:"marriage",
                schema: MarriageSchema
            }
        ]),
        
        AadharModule,
        CloudinaryModule,
        CounterModule,
        OfficeDepartmentModule,
        ApplicationModule,
        SlotModule,
    ],

        controllers: [MarriageController],
        providers: [MarriageService,MarriageRepository,],
        exports: [MarriageService,MarriageRepository,],

})

export class MarriageModule {}