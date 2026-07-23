import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeathRepository } from "./death.repository";
import { DeathService } from "./death.service";
import { DeathController } from "./death.controller";
import { Death, DeathSchema } from "./schema/death.schema";
import { AadharModule } from "../aadhar/aadhar.module";
import { OfficeDepartmentModule } from "../officeDepartment/officeDepartment.module";
import { SlotModule } from "../slot/slot.module";
import { CloudinaryModule } from "../../common/cloudinary/cloudinary.module";
import { CounterModule } from "../counter/counter.module";
import { JwtModule } from "@nestjs/jwt";
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
                name:"death",
                schema: DeathSchema
            }
        ]),
        CounterModule,    
        AadharModule,
        CloudinaryModule,
        CounterModule,
        OfficeDepartmentModule,
        ApplicationModule,
        SlotModule,
    ], 

    controllers: [DeathController],
    providers: [DeathService,DeathRepository],
    exports: [DeathService,DeathRepository],

})

export class DeathModule {}

