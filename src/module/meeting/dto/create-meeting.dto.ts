import { IsMongoId, IsOptional, IsEnum, IsString, IsNotEmpty, IsDateString } from "class-validator";
import { MeetingStatusEnum } from "../../../common/enums/meeting.status.enums";


export class CreateMeetingDto {

    @IsNotEmpty()
    @IsMongoId()
    applicationId!:string;

    @IsNotEmpty()
    @IsString()
    roomId!:string;

    @IsNotEmpty()
    @IsEnum(MeetingStatusEnum)
    status?:MeetingStatusEnum;

    @IsOptional()
    @IsDateString()
    userJoinedAt?: Date;

    @IsOptional()
    @IsDateString()
    clerkJoinedAt?: Date;

    @IsOptional()
    @IsDateString()
    startedAt?: Date;

    @IsOptional()
    @IsDateString()
    endedAt?: Date;
}