import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MarriageRepository } from "./marriage.repository";
import { MarriageService } from "./marriage.service";
import { MarriageController } from "./marriage.controller";
import { Marriage, MarriageSchema } from "./schema/marriage.schema";
import { AadharModule } from "../aadhar/aadhar.module";
import { CloudinaryModule } from "../../common/cloudinary/cloudinary.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Marriage.name,
                schema: MarriageSchema
            }
        ]),
        
        AadharModule,
        CloudinaryModule,
    ],

        controllers: [MarriageController],
        providers: [MarriageService,MarriageRepository,],
        exports: [MarriageService,MarriageRepository,],

})

export class MarriageModule {}