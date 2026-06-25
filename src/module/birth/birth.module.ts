import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BirthRepository } from "./birth.repositroy";
import { BirthService } from "./birth.service";
import { BirthController } from "./birth.controller";
import { Birth, BirthSchema } from "./schema/birth.schema";
import { CounterModule } from "../counter/counter.module";
import { AadharModule } from "../aadhar/aadhar.module";
import { CloudinaryModule } from "../../common/cloudinary/cloudinary.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Birth.name,
                schema: BirthSchema
            }
        ]),
        CounterModule,
        AadharModule,
        CloudinaryModule,
    ], 

        controllers: [BirthController],
        providers: [BirthService,BirthRepository,],
        exports: [BirthService,BirthRepository,],

})

export class BirthModule {}