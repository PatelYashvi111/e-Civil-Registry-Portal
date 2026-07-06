import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApplicationRepository } from "../application/application.repository";
import { ApplicationService } from "../application/application.service";
import { ApplicationController } from "../application/application.controller";
import { Application, ApplicationSchema } from "./schema/application.schema";
import { RoleModule } from "../role/role.module";
import { OfficeDepartmentModule } from "../officeDepartment/officeDepartment.module";
import { CounterModule } from "../counter/counter.module";
import { UserModule } from "../user/user.module";
import { SlotModule } from "../slot/slot.module";

@Module({
    imports: [
       MongooseModule.forFeature([
        {
          name: Application.name,
          schema: ApplicationSchema,
        },
        ]),
        UserModule,
        SlotModule,
        RoleModule,
        OfficeDepartmentModule,
        CounterModule,
    ],

    controllers: [ApplicationController],
    providers: [ApplicationService,ApplicationRepository],
    exports: [ApplicationService,ApplicationRepository],

})

export class ApplicationModule {}