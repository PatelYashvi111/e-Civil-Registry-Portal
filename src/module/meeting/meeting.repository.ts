import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Meeting, MeetingDocument } from "./schema/meeting.schema";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { toObjectId } from "../../common/utils/objectId.utils";
import { MeetingStatusEnum } from "src/common/enums/meeting.status.enums";
import { DateFilterEnum } from "src/common/enums/date.status.enums";
import { FilterMeetingDto } from "./dto/filter-meeting.dto";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { PaginationUtil } from "src/common/utils/pagination.utils";
import { OfficeDepartment } from "../officeDepartment/schema/officeDepartment.schema";

@Injectable()
export class MeetingRepository {
    constructor(
        @InjectModel(Meeting.name)
        private readonly meetingModel: Model<MeetingDocument>,
    ) {}

    async create(createMeetingDto: CreateMeetingDto) {
        const meetingData = {
         ...createMeetingDto,
         applicationId: toObjectId(createMeetingDto.applicationId)
        }
        return await this.meetingModel.create(meetingData);
    }

    async findAll(filterMeetingDto: FilterMeetingDto) {
      const {page = 1, limit = 5, status, dateFilter} = filterMeetingDto;

      const skip = PaginationUtil.getSkip(page, limit);

      const meetings = await this.meetingModel
        .find()
        .populate({
          path: "applicationId",
          populate: [
            {
              path: "userId",
              populate: [
                { path: "roleId" },
                { path: "aadharId" },
              ],
            },
            {
              path: "clerkId",
            },
            {
              path: "slotId",
            },
            {
              path: "officeDepartmentId",
              populate: [
                {
                  path: "officeId",
                  populate: {
                    path: "districtId",
                    populate: {
                      path: "stateId",
                    },
                  },
                },
                {
                  path: "departmentId",
                },
              ],
            },
          ],
        });

  
      let filteredMeetings = meetings;

      if (status) {
        filteredMeetings = filteredMeetings.filter(
          (meeting: any) => meeting.status === status,
        );
      }

    if (dateFilter && dateFilter !== DateFilterEnum.ALL) {
      const targetDate = new Date();

      if (dateFilter === DateFilterEnum.TOMORROW) {
        targetDate.setUTCDate(targetDate.getUTCDate() + 1);
      }

      filteredMeetings = filteredMeetings.filter((meeting: any) => {
        const meetingDate = new Date(meeting.meetingDate);

        return (
          meetingDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
          meetingDate.getUTCMonth() === targetDate.getUTCMonth() &&
          meetingDate.getUTCDate() === targetDate.getUTCDate()
        );
      });

    }

      const data = filteredMeetings.slice(skip, skip + limit);

      const total = filteredMeetings.length;
      
      return {
        ...PaginationUtil.getPaginationResponse(
        data,
        total,
        page,
        limit,
        ),
        status,
        dateFilter,
      };
    }

    async findById(id: string) {
        return await this.meetingModel
            .findById(id)
            .populate({
            path: "applicationId",
            populate: [
                {
                path: "userId",
                populate: [
                    { path: "roleId" },
                    { path: "aadharId" },
                ],
                },
                {
                path: "clerkId",
                },
                {
                path: "slotId",
                },
                {
                path: "officeDepartmentId",
                populate: [
                     { path: "officeId",
                        populate: ({
                             path: "districtId",
                                populate: ({
                                   path: "stateId",
                                })
                        }),
                     },
                    { path: "departmentId" },                
                ],
                },
            ],
            });
    }


    async findByApplicationId(applicationId:string){
    return await this.meetingModel.findOne({
        applicationId: toObjectId(applicationId)
    });
  }

    async findByRoomId(roomId: string) {
        return await this.meetingModel.findOne({ roomId })
        .populate({
          path: 'applicationId',
          populate: [
            {
              path: 'userId',
              populate: [
                { path: 'roleId' },
                { path: 'aadharId' },
              ],
            },
            {
              path: 'clerkId',
              populate: [
                { path: 'roleId' },
                { path: 'aadharId' },
              ],
            },
            { path: 'slotId' },
            { path: 'officeDepartmentId',
              populate: [
                {
                  path: 'officeId',
                  populate: {
                    path: 'districtId',
                    populate: {
                      path: 'stateId',
                    },
                  },
                },
                {
                  path: 'departmentId',
                },
              ],
            },
            { path: 'serviceId', 
              populate: [
                    {
                      path: "fatherAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "motherAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "officeDepartmentId",
                      model: OfficeDepartment.name,
                      strictPopulate: false,
                      populate: [
                        {
                          path: "officeId",
                          populate: {
                             path: "districtId",
                             populate: {
                              path: "stateId",
                             },
                          },
                        },
                        {
                          path: "departmentId",
                        },
                      ],
                    },
                    {
                      path: "brideAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "groomAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "witnessAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "brahmanAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "deceasedAadharId",
                      strictPopulate: false,
                    },
                    {
                      path: "applicantAadharId",
                      strictPopulate: false,
                    },
                  ],
            },
          ],
        });
    }

    async update(id: string, updateMeetingDto: UpdateMeetingDto) {
        return await this.meetingModel.findByIdAndUpdate(
            id,
            updateMeetingDto,
            {
                new: true,
            },
        );
    }
 

    async delete(id: string) {
        return await this.meetingModel.findByIdAndDelete(id);
    }
}