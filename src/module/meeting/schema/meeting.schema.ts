import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { MeetingStatusEnum } from "../../../common/enums/meeting.status.enums";

export type MeetingDocument = HydratedDocument<Meeting>;

@Schema({
  timestamps: true,
})
export class Meeting {
  @Prop({
    type: Types.ObjectId,
    ref: "Application",
    required: true,
  })
  applicationId!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  roomId!: string;

  @Prop({
    type: String,
    enum: MeetingStatusEnum,
    default: MeetingStatusEnum.WAITING,
  })
  status!: MeetingStatusEnum;

  @Prop({
    type: Date,
    default: null,
  })
  userJoinedAt?: Date;

  @Prop({
    type: Date,
    default: null,
  })
  clerkJoinedAt?: Date;

  @Prop({
    type: Date,
    default: null,
  })
  startedAt?: Date;

  @Prop({
    type: Date,
    default: null,
  })
  endedAt?: Date;

  @Prop({
    required: true,
    type: String,
  })
  meetingLink?: string;

}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);