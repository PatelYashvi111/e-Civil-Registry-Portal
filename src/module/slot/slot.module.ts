import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SlotRepository } from "./slot.repository";
import { SlotService } from "./slot.service";
import { SlotController } from "./slot.controller";
import { SlotCron } from "./slot.cron";
import { Slot, SlotSchema } from "./schema/slot.schema";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";
import { OfficeDepartmentModule } from "../officeDepartment/officeDepartment.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Slot.name,
                schema: SlotSchema
            }
        ]),
        UserModule,
        RoleModule,
        OfficeDepartmentModule
    ],

    controllers: [SlotController],
    providers: [SlotService,SlotRepository,SlotCron],
    exports: [SlotService,SlotRepository],

})

export class SlotModule {}