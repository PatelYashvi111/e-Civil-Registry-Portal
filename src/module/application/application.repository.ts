import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Application, ApplicationDocument } from "./schema/application.schema";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationStatusEnum } from "../../common/enums/application.status.enums";
import { Types } from "mongoose";
import { toObjectId } from "src/common/utils/objectId.utils";

@Injectable()
export class ApplicationRepository {

    constructor(
        @InjectModel(Application.name)
        private readonly applicationModel: Model<ApplicationDocument>
    ) {}

    async createApplication( createApplicationDto: CreateApplicationDto ) {
        const applicationData = {
            ...createApplicationDto,
            userId: toObjectId(createApplicationDto.userId),
            clerkId: toObjectId(createApplicationDto.clerkId),
            officeDepartmentId: toObjectId(createApplicationDto.officeDepartmentId),
            slotId: toObjectId(createApplicationDto.slotId),
            serviceId: toObjectId(createApplicationDto.serviceId),
        };
    
        const application = await this.applicationModel.create(applicationData);

        return application;
    }

    async findAll(skip: number, limit: number, status?: ApplicationStatusEnum)
     {
        const filter: any = {};

        if(status) {
            filter.status = status;
        }

        return await this.applicationModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 })
        .populate({
            path: 'userId',
            populate: {
                path: 'aadharId',
            },
        });
    }

    async findById(id: string) {
    return await this.applicationModel
    .findById(id)
    .populate({
      path: "userId",
      populate: [{
        path: "roleId",
      },
      {
        path: "aadharId",
      }],
    })
    .populate("clerkId")
    .populate({
      path: "officeDepartmentId",
      populate: [
        { path: "officeId",
          populate: {
            path: "districtId",
            populate: {
              path: "stateId",
            },
          },
        },
        { path: "departmentId" },
      ],
    })
    .populate("slotId")
    .populate({
     path: "serviceId",
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
  })
}

    async findByUserId(userId: string, skip: number, limit: number, status?: ApplicationStatusEnum) {
        const filter: any = { userId };

        if(status) {
            filter.status = status;
        }

        return await this.applicationModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async findByApplicationNumber( applicationNumber: string ) {
        return await this.applicationModel.findOne({ applicationNumber });
    }

    async getMonthlyApplications(year: number) {
    return await this.applicationModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $year: "$createdAt" }, year],
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

   async updateApplication(
    id:string,
    updateApplicationDto:UpdateApplicationDto
    ){
    return await this.applicationModel.findByIdAndUpdate(
        id,
        updateApplicationDto,
        {new: true}
    );
   }

    async deleteApplication( id: string ) {
        return await this.applicationModel.findByIdAndDelete( id );
    }

}