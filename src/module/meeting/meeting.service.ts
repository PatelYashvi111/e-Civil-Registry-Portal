import { Injectable,BadRequestException, NotFoundException, UnauthorizedException} from "@nestjs/common";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { MeetingRepository } from "./meeting.repository";
import { ApplicationRepository } from "../application/application.repository";
import { CounterService } from "../counter/counter.service";
import { EmailService } from "../email/email.service";
import { ApplicationStatusEnum } from "src/common/enums/application.status.enums";
import { FilterMeetingDto } from "./dto/filter-meeting.dto";
import { MeetingStatusEnum } from "src/common/enums/meeting.status.enums";
import { User } from "../user/schema/user.schema";
import { UserService } from "../user/user.service";
import { Types } from "mongoose";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeetingService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

    async create(createMeetingDto: CreateMeetingDto) {

    const application = await this.applicationRepository.findById(createMeetingDto.applicationId);

   if (!application) {
      throw new NotFoundException("Application not found");
    }

    const slot = application.slotId as any;

    createMeetingDto.meetingDate = slot.slotDate;
    createMeetingDto.meetingTime = `${slot.startTime} - ${slot.endTime}`;

    const existingMeeting = await this.meetingRepository.findByApplicationId(createMeetingDto.applicationId);

    if (existingMeeting) {
      throw new BadRequestException("Meeting already exists for this application");
    }

    if (application.status !== ApplicationStatusEnum.PENDING) {
      throw new BadRequestException("Meeting can only be created for pending applications");
    }

    const roomId = await this.counterService.generateMeetingRoomId();

    createMeetingDto.roomId = roomId;

    const meetingLink = `${process.env.FRONTEND_URL}/meeting/${roomId}`;

    createMeetingDto.meetingLink = meetingLink;

    createMeetingDto.status = MeetingStatusEnum.SCHEDULED;

    const meeting = await this.meetingRepository.create(createMeetingDto);

    // 1. You only have the ObjectId
  const userIdString = application.userId.toString();

  // 2. Look up the full user in the database
  const user = await this.userService.findById(userIdString);
  // OR: const user = await this.userModel.findById(userIdString);

  // 3. Now you have the email!
  const userEmail = user.email;

  // 4. Send the email
  await this.emailService.sendMeetingLinkToUser(
    userEmail,
    meetingLink,
  );

  return meeting;
  }

  async findAll(filterMeetingDto: FilterMeetingDto) {
    return await this.meetingRepository.findAll(filterMeetingDto);
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
  
    async findByRoomId(roomId: string, currentUser?: User & { _id: Types.ObjectId | string }) {
      const meeting = await this.meetingRepository.findByRoomId(roomId);

      if (!meeting) {
        throw new NotFoundException("Meeting not found");
      }

      // Authorization block for Gateway socket connections
    if (currentUser) {
      const application = meeting.applicationId as any;

      if (!application) {
        throw new NotFoundException("Application details not found for this meeting.");
      }

      const appUserId = application.userId?._id?.toString();
      const appClerkId = application.clerkId?._id?.toString();
      const currentUserId = currentUser._id.toString();

      const isUser = appUserId === currentUserId;
      const isClerk = appClerkId === currentUserId;

      if (!isUser && !isClerk) {
        throw new UnauthorizedException("You are not authorized to join this meeting room.");
      }
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

    status: meeting.status === MeetingStatusEnum.SCHEDULED
      ? MeetingStatusEnum.WAITING
      :meeting.status
  }as any);
 }

  async clerkJoined(roomId: string) {
    const meeting = await this.meetingRepository.findByRoomId(roomId);

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return await this.meetingRepository.update(meeting._id.toString(), {
      clerkJoinedAt: new Date(),

      status: meeting.status === MeetingStatusEnum.SCHEDULED
        ? MeetingStatusEnum.WAITING
        :meeting.status
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

   async waitingMeeting(roomId: string) {
      const meeting = await this.meetingRepository.findByRoomId(roomId);

      if(!meeting) {
        throw new NotFoundException('Meeting not found');
      }

      return await this.meetingRepository.update(
        meeting._id.toString(),
        {
          status: MeetingStatusEnum.WAITING,
        } as any,
      );
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

    async cancelMeeting(roomId: string) {
      const meeting = await this.meetingRepository.findByRoomId(roomId);

      if(!meeting) {
        throw new NotFoundException('Meeting Not Found');
      }

      return await this.meetingRepository.update(meeting._id.toString(), {
        status: MeetingStatusEnum.CANCELLED,
      }as any);
    }

    async joinMeeting(roomId: string, userId: string) {
      const meeting = await this.meetingRepository.findByRoomId(roomId);

      if (!meeting) {
        throw new NotFoundException('Meeting not found');
      }

            console.log("Meeting Status:", meeting.status);

      if (
        meeting.status === MeetingStatusEnum.CANCELLED ||
        meeting.status === MeetingStatusEnum.COMPLETED
      ) {
        throw new BadRequestException('Meeting cannot be joined.');
      }

      const application = await this.applicationRepository.findById(meeting.applicationId._id.toString());

      if (!application) {
        throw new NotFoundException('Application not found');
      }
 
      const UserId = application.userId._id.toString();
      const ClerkId = application.clerkId._id.toString();

      const isUser = UserId === userId;
      const isClerk = ClerkId === userId;


      if (!isUser && !isClerk) {
        throw new BadRequestException('Unauthorized user');
      }

      return {
        message: 'You can join the meeting.',
        applicationId: meeting.applicationId,
        roomId: meeting.roomId,
        meetingLink: meeting.meetingLink,
        meetingDate: meeting.meetingDate,
        meetingTime: meeting.meetingTime,
        userJoinedAt: meeting.userJoinedAt,
        clerkJoinedAt: meeting.clerkJoinedAt,
        startedAt: meeting.startedAt,
        endedAt: meeting.endedAt,
        status: meeting.status,
      };
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

    getIceServers() {
      const iceServers: {
        urls: string;
      }[] = [];
            
        const stunUrl = this.configService.get<string>('STUN_URL');

        if (stunUrl) {
          iceServers.push({urls: stunUrl});
        }

        return {
          iceServers,
        };
      }
}
