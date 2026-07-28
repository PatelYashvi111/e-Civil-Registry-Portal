import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MeetingController } from "./meeting.controller";
import { MeetingService } from "./meeting.service";
import { MeetingRepository } from "./meeting.repository";
import { Meeting, MeetingSchema } from "./schema/meeting.schema";
import { ApplicationModule } from "../application/application.module";
import { CounterModule } from "../counter/counter.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meeting.name,
        schema: MeetingSchema,
      },
    ]),

    ApplicationModule,
    CounterModule,
  ],

  controllers: [MeetingController],
  providers: [MeetingService,MeetingRepository],
  exports: [MeetingService,MeetingRepository],
  
})
export class MeetingModule {}