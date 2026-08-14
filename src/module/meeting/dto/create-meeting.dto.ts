import { IsMongoId, IsOptional, IsEnum, IsString, IsNotEmpty, IsDateString } from "class-validator";
import { MeetingStatusEnum } from "../../../common/enums/meeting.status.enums";

export class CreateMeetingDto {

    @IsNotEmpty()
    @IsMongoId()
    applicationId!: string;

    @IsOptional()
    @IsString()
    roomId?: string;

    @IsOptional()
    @IsEnum(MeetingStatusEnum)
    status?: MeetingStatusEnum;

    @IsOptional()
    @IsString()
    meetingLink?: string;

    @IsOptional()
    @IsDateString()
    meetingDate?: Date;

    @IsOptional()
    @IsString()
    meetingTime?: string;
}