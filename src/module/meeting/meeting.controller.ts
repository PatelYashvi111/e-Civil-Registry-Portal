import { Body, Controller, Delete, Get, Param, Patch, Post, Query} from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { FilterDto } from "../application/dto/filter-application.dto";

@Controller("meeting")
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post("create")
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingService.create(createMeetingDto);
  }

  @Get("all")
  async findAll(@Query() filterDto: FilterDto) {
    return await this.meetingService.findAll(filterDto);
  }

  @Get("application/:applicationId")
  async findByApplicationId(@Param("applicationId") applicationId: string) {
    return await this.meetingService.findByApplicationId(applicationId);
  }

  @Get("room/:roomId")
  async findByRoomId(@Param("roomId") roomId: string) {
    return await this.meetingService.findByRoomId(roomId);
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.meetingService.findById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string,@Body() updateMeetingDto: UpdateMeetingDto) {
    return await this.meetingService.update(id, updateMeetingDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.meetingService.delete(id);
  }
}