import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Meeting, MeetingDocument } from "./schema/meeting.schema";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { toObjectId } from "../../common/utils/objectId.utils";

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

    async findAll(skip: number, limit: number, page: number) {
        const data = await this.meetingModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate({
            path: "applicationId",
            populate: [
                {
                path: "userId",
                populate: [
                    { path: "roleId" },
                    { path: "aadharId" }
                ]
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
    
        const total = await this.meetingModel.countDocuments();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
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
        return await this.meetingModel.findOne({ roomId });
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