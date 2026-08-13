import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MeetingController } from "./meeting.controller";
import { MeetingService } from "./meeting.service";
import { MeetingRepository } from "./meeting.repository";
import { Meeting, MeetingSchema } from "./schema/meeting.schema";
import { ApplicationModule } from "../application/application.module";
import { CounterModule } from "../counter/counter.module";
import { EmailModule } from "../email/email.module";
import { MeetingGateway } from "./meeting.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meeting.name,
        schema: MeetingSchema,
      },
    ]),

     forwardRef(() => ApplicationModule),
    CounterModule,
    EmailModule,
  ],

  controllers: [MeetingController],
  providers: [MeetingService,MeetingRepository,MeetingGateway],
  exports: [MeetingService,MeetingRepository],
  
})
export class MeetingModule {}