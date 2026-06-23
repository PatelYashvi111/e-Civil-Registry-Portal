import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BirthRepository } from "./birth.repositroy";
import { BirthService } from "./birth.service";
import { BirthController } from "./birth.controller";
import { Birth, BirthSchema } from "./schema/birth.schema";
import { AadharModule } from "../aadhar/aadhar.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Birth.name,
                schema: BirthSchema
            }
        ]),

        AadharModule,
    ], 

        controllers: [BirthController],
        providers: [BirthService,BirthRepository,],
        exports: [BirthService,BirthRepository,],

})

export class BirthModule {}