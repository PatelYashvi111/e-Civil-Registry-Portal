import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SlotRepository } from "./slot.repository";
import { SlotService } from "./slot.service";
import { SlotController } from "./slot.controller";
import { Slot, SlotSchema } from "./schema/slot.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:Slot.name,
                schema: SlotSchema
            }
        ]),
    ],

    controllers: [SlotController],
    providers: [SlotService,SlotRepository],
    exports: [SlotService,SlotRepository],

})

export class SlotModule {}