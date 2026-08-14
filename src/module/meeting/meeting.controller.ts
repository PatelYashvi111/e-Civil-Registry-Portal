import { Body, Controller, Delete, Get, Param, Patch, Post, Query} from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { FilterMeetingDto } from "./dto/filter-meeting.dto";
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller("meeting")
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post("create")
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return await this.meetingService.create(createMeetingDto);
  }

  @Get("all")
  async findAll(@Query() filterMeetingDto: FilterMeetingDto) {
    return await this.meetingService.findAll(filterMeetingDto);
  }

  @Get("ice-servers")
  getIceServers() {
    return this.meetingService.getIceServers();
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

  // @Patch('join/:roomId')
  // async joinMeeting(
  // @Param('roomId') roomId: string,
  // @Body() body: { userId: string },
  // ) {
  //   return await this.meetingService.joinMeeting(roomId, body.userId);
  // }

  @Patch('join/:roomId')
@UseGuards(AuthGuard('jwt'))
async joinMeeting(
  @Param('roomId') roomId: string,
  @Req() req: any,
) {
  return await this.meetingService.joinMeeting(
    roomId,
    req.user.userId, 
  );
}

  @Patch('end/:roomId')
  async endMeeting(@Param('roomId') roomId: string) {
    return await this.meetingService.endMeeting(roomId);
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