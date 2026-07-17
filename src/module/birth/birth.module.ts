import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BirthRepository } from "./birth.repositroy";
import { BirthService } from "./birth.service";
import { BirthController } from "./birth.controller";
import { Birth, BirthSchema } from "./schema/birth.schema";
import { AadharModule } from "../aadhar/aadhar.module";
import { CloudinaryModule } from "../../common/cloudinary/cloudinary.module";
import { CounterModule } from "../counter/counter.module";
import { JwtModule } from "@nestjs/jwt";

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
                name:Birth.name,
                schema: BirthSchema
            }
        ]),
        AadharModule,
        CloudinaryModule,
        CounterModule,
    ], 

        controllers: [BirthController],
        providers: [BirthService,BirthRepository,],
        exports: [BirthService,BirthRepository,],

})

export class BirthModule {}