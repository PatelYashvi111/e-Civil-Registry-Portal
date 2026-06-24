import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MarriageRepository } from "./marriage.repository";
import { MarriageService } from "./marriage.service";
import { MarriageController } from "./marriage.controller";
import { Marriage, MarriageSchema } from "./schema/marriage.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Marriage.name,
                schema: MarriageSchema
            }
        ])
    ],

        controllers: [MarriageController],
        providers: [MarriageService,MarriageRepository],
        exports: [MarriageService,MarriageRepository],

})

export class MarriageModule {}