import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { model, Model } from "mongoose";
import { Application, ApplicationDocument } from "./schema/application.schema";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationStatusEnum } from "../../common/enums/application.status.enums";
import { Types } from "mongoose";
import { toObjectId } from "src/common/utils/objectId.utils";
import { OfficeDepartment } from "../officeDepartment/schema/officeDepartment.schema";
import { Aadhar } from "../aadhar/schema/aadhar.schema";

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

    async findAll(skip: number, limit: number, page: number, search?: string, status?: ApplicationStatusEnum)
     {
        const match: any = {};

        if(status) {
            match.status = status;
        }

    const pipeline: any[] = [
  {
    $match: match,
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "aadhars", 
      localField: "user.aadharId",
      foreignField: "_id",
      as: "aadhar",
    },
  },
  {
    $unwind: {
      path: "$aadhar",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "clerkId",
      foreignField: "_id",
      as: "clerk",
    },
  },
  {
    $unwind: {
      path: "$clerk",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "officedepartments",
      localField: "officeDepartmentId",
      foreignField: "_id",
      as: "officeDepartment",
    },
  },
  {
    $unwind: {
      path: "$officeDepartment",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "offices",
      localField: "officeDepartment.officeId",
      foreignField: "_id",
      as: "office",
    },
  },
  {
    $unwind: {
      path: "$office",
      preserveNullAndEmptyArrays: true, 
  },
},
{
  $lookup: {
    from: "departments",
    localField: "officeDepartment.departmentId",
    foreignField: "_id",
    as: "department",
  },
},
{
     $unwind: {
      path: "$department",
      preserveNullAndEmptyArrays: true, 
  }, 
},
{
  $lookup: {
    from: "districts",
    localField: "office.districtId",
    foreignField: "_id",
    as: "district",
  },
},
{
  $unwind: {
    path: "$district",
    preserveNullAndEmptyArrays: true,
  },
},
{
  $lookup: {
    from: "states",
    localField: "district.stateId",
    foreignField: "_id",
    as: "state",
  },
},
{
  $unwind: {
    path: "$state",
    preserveNullAndEmptyArrays: true,
  },
},
  {
    $lookup: {
      from: "slots",
      localField: "slotId",
      foreignField: "_id",
      as: "slot",
    },
  },
  {
    $unwind: {
      path: "$slot",
      preserveNullAndEmptyArrays: true,
    },
  },
];

if (search) {
  pipeline.push({
    $match: {
      $or: [
        {
          "aadhar.firstName": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "aadhar.lastName": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "applicationNumber": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "serviceType": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "status": {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }, 
  });
}

const countPipeline = [...pipeline];

countPipeline.push({
  $count: "total",
});

const countResult = await this.applicationModel.aggregate(countPipeline);

const total = countResult.length ? countResult[0].total : 0;

pipeline.push({
  $sort: {
    createdAt: -1,
  },
});

pipeline.push(
  {
    $skip: skip,
  },
  {
    $limit: Number(limit),
  },
);

pipeline.push({
  $project: {
    _id: 1,
    applicationNumber: 1,
    serviceType: 1,
    status: 1,
    createdAt: 1,

    userId: {
      _id: "$user._id",

      aadharId: "$aadhar",
    },

    clerkId: "$clerk",
    
    officeDepartmentId: {
      _id: "$officeDepartment._id",

      officeId: {
        _id: "$office._id",
        name: "$office.name",

         districtId: {
        _id: "$district._id",
        name: "$district.name",

         stateId: {
        _id: "$state._id",
        name: "$state.name",
       },
      },
    },

      departmentId: {
        _id: "$department._id",
        name: "$department.name",
      }
    },

    slotId: "$slot",

  },
});

const data = await this.applicationModel.aggregate(pipeline);

return {
  data,
  total,
  page,
  limit,
  search,
  status,
  totalPages: Math.ceil(total / limit),
};
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