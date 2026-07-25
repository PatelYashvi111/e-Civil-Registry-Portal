import { Injectable,BadRequestException, NotFoundException} from "@nestjs/common";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { MeetingRepository } from "./meeting.repository";
import { ApplicationRepository } from "../application/application.repository";
import { ApplicationStatusEnum } from "src/common/enums/application.status.enums";
import { FilterDto } from "../application/dto/filter-application.dto";
import { MeetingStatusEnum } from "src/common/enums/meeting.status.enums";
import { Types } from "mongoose";

@Injectable()
export class MeetingService {
  constructor(
    private readonly meetingRepository: MeetingRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
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

  const room = await this.meetingRepository.findByRoomId(createMeetingDto.roomId);

  if (room) {
    throw new BadRequestException("Room ID already exists");
  }

  return await this.meetingRepository.create(createMeetingDto);
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

  async findByApplicationId(applicationId: string) {
   
    if (!Types.ObjectId.isValid(applicationId)) {
       throw new BadRequestException("Invalid Application ID");
   }

    const meeting = await this.meetingRepository.findByApplicationId(applicationId);

    if (!meeting) {
        throw new NotFoundException("Meeting not found");
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

    async update(id: string,updateMeetingDto: UpdateMeetingDto) {
      const meeting = await this.meetingRepository.findById(id);

      if (!meeting) {
          throw new NotFoundException("Meeting not found");
      }

      if (updateMeetingDto.applicationId) {
          throw new BadRequestException("Application cannot be changed");
      }

      if (updateMeetingDto.roomId) {

      const room = await this.meetingRepository.findByRoomId(updateMeetingDto.roomId);

      if (room && room._id.toString() !== id) {
          throw new BadRequestException("Room ID already exists");
      }
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