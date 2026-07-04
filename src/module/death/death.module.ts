import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeathRepository } from "./death.repository";
import { DeathService } from "./death.service";
import { DeathController } from "./death.controller";
import { Death, DeathSchema } from "./schema/death.schema";
<<<<<<< HEAD
=======
import { AadharModule } from "../aadhar/aadhar.module";
import { CloudinaryModule } from "../../common/cloudinary/cloudinary.module";
import { CounterModule } from "../counter/counter.module";
>>>>>>> feat/user

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Death.name,
                schema: DeathSchema
            }
        ]),
        CounterModule,    
        AadharModule,
        CloudinaryModule,
        CounterModule,
    ], 

    controllers: [DeathController],
    providers: [DeathService,DeathRepository],
    exports: [DeathService,DeathRepository],

})

export class DeathModule {}

