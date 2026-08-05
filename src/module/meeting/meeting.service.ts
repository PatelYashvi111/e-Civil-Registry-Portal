import { Injectable,BadRequestException, NotFoundException} from "@nestjs/common";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { MeetingRepository } from "./meeting.repository";
import { ApplicationRepository } from "../application/application.repository";
import { CounterService } from "../counter/counter.service";
import { EmailService } from "../email/email.service";
import { ApplicationStatusEnum } from "src/common/enums/application.status.enums";
import { FilterDto } from "../application/dto/filter-application.dto";
import { MeetingStatusEnum } from "src/common/enums/meeting.status.enums";
import { Types } from "mongoose";

@Injectable()
export class MeetingService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly counterService: CounterService,
    private readonly emailService: EmailService,
  ) {}

    async create(createMeetingDto: CreateMeetingDto) {

     console.log("Received applicationId:", createMeetingDto.applicationId);

    const application = await this.applicationRepository.findById(createMeetingDto.applicationId);

  if (!application) {
    throw new NotFoundException("Application not found");
  }

  const existingMeeting = await this.meetingRepository.findByApplicationId(createMeetingDto.applicationId);

  if (existingMeeting) {
    throw new BadRequestException("Meeting already exists for this application");
  }

  if (application.status !== ApplicationStatusEnum.APPROVED) {
    throw new BadRequestException("Meeting can only be created for approved applications");
  }

  const roomId = await this.counterService.generateMeetingRoomId();

  createMeetingDto.roomId = roomId;

  console.log("MeetingRoomId", roomId);

  const meetingLink = `${process.env.FRONTEND_URL}/meeting/${roomId}`;

createMeetingDto.meetingLink = meetingLink;

  const meeting = await this.meetingRepository.create(createMeetingDto);

// // const userEmail = application.userId.email;
// // const clerkEmail = application.clerkId.email;

// await this.emailService.sendMeetingLinkToUser(
//   userEmail,
//   meetingLink,
// );

// await this.emailService.sendMeetingLinkToClerk(
//   clerkEmail,
//   meetingLink,
// );

return meeting;
}

  async findAll(filterDto: FilterDto) {
    const { page = 1, limit = 10} = filterDto;

    const skip = (page - 1) * limit;

    return await this.meetingRepository.findAll(skip,limit,page);
  }

  async findById(id: string) {

     if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException("Invalid Meeting ID");
    }

    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException("Meeting not found");
    }

    return meeting;  
      }

    async findByApplicationId(applicationId:string){

    if(!Types.ObjectId.isValid(applicationId)){
        throw new BadRequestException(
          "Invalid Application ID"
        );
    }

    const meeting =
      await this.meetingRepository.findByApplicationId(applicationId);


    if(!meeting){
        throw new NotFoundException(
          "Meeting not found"
        );
    }

    return meeting;
}
  
    async findByRoomId(roomId: string) {
      const meeting = await this.meetingRepository.findByRoomId(roomId);

      if (!meeting) {
        throw new NotFoundException("Meeting not found");
      }

      return meeting;
    }

  async userJoined(roomId: string) {
     const meeting = await this.meetingRepository.findByRoomId(roomId);

  if (!meeting) {
    throw new NotFoundException('Meeting not found');
  }

  return await this.meetingRepository.update(meeting._id.toString(), {
    userJoinedAt: new Date(),
  } as any);
 }

  async clerkJoined(roomId: string) {
    const meeting = await this.meetingRepository.findByRoomId(roomId);

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return await this.meetingRepository.update(meeting._id.toString(), {
      clerkJoinedAt: new Date(),
    } as any);
  }

  async startMeeting(roomId: string) {
    const meeting = await this.meetingRepository.findByRoomId(roomId);

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return await this.meetingRepository.update(meeting._id.toString(), {
      status: MeetingStatusEnum.IN_PROGRESS,
      startedAt: new Date(),
    } as any);
  }

    async endMeeting(roomId: string) {
      const meeting = await this.meetingRepository.findByRoomId(roomId);

      if (!meeting) {
        throw new NotFoundException('Meeting not found.');
      }

      return await this.meetingRepository.update(meeting._id.toString(), {
        status: MeetingStatusEnum.COMPLETED,
        endedAt: new Date(),
      } as any);
    }

    async update(id: string,updateMeetingDto: UpdateMeetingDto) {
      const meeting = await this.meetingRepository.findById(id);

      if (!meeting) {
          throw new NotFoundException("Meeting not found");
      }

      if (updateMeetingDto.applicationId) {
          throw new BadRequestException("Application cannot be changed");
      }

    const updatedMeeting = await this.meetingRepository.update(id, updateMeetingDto);

      return updatedMeeting;

    }

    async delete(id: string) {
      const meeting = await this.meetingRepository.findById(id);

      if (!meeting) {
        throw new NotFoundException("Meeting not found");
      }

      if (meeting.status === MeetingStatusEnum.COMPLETED) {
        throw new BadRequestException("Completed meeting cannot be deleted");
    }

      return await this.meetingRepository.delete(id);
    }
}
