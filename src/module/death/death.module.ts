import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeathRepository } from "./death.repository";
import { DeathService } from "./death.service";
import { DeathController } from "./death.controller";
import { Death, DeathSchema } from "./schema/death.schema";
import { CounterModule } from "../counter/counter.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Death.name,
                schema: DeathSchema
            }
        ]),
        CounterModule,
    ], 

    controllers: [DeathController],
    providers: [DeathService,DeathRepository],
    exports: [DeathService,DeathRepository],

})

export class DeathModule {}

