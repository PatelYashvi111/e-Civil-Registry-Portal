import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BirthRepository } from "./birth.repositroy";
import { BirthService } from "./birth.service";
import { BirthController } from "./birth.controller";
import { Birth, BirthSchema } from "./schema/birth.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Birth.name,
                schema: BirthSchema
            }
        ])
    ], 

        controllers: [BirthController],
        providers: [BirthService,BirthRepository],
        exports: [BirthService,BirthRepository],

})

export class BirthModule {}