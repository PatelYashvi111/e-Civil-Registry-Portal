import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Clerk, ClerkDocument } from './schema/clerk.schema';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { UpdateClerkDto } from './dto/update-clerk.dto';
import { toObjectId } from 'src/common/utils/objectId.utils';

@Injectable()
export class ClerkRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Clerk.name)
    private readonly clerkModel: Model<ClerkDocument>,
  ) {}

  async createClerk(
    createClerkDto: CreateClerkDto,
    roleId: string,
  ) {
    const createdClerk = new this.userModel({
      ...createClerkDto,
      roleId: toObjectId(roleId),
      aadharId: toObjectId(createClerkDto.aadharId),
      officeDepartmentId: toObjectId(createClerkDto.officeDepartmentId),
    });

    const savedClerk = await createdClerk.save();

    const clerk = await this.userModel
      .findById(savedClerk._id)
      .populate('roleId')
      .populate('aadharId')
      .populate('officeDepartmentId')

    return clerk;
  }

  async findAllClerks(
  clerkRoleId: string,
  skip: number,
  limit: number,
  page: number,
  search?: string,
) {

  const pipeline: any[] = [

    {
      $match: {
        roleId: toObjectId(clerkRoleId),
      },
    },

    {
      $lookup: {
        from: 'aadhars',
        localField: 'aadharId',
        foreignField: '_id',
        as: 'aadhar',
      },
    },
    {
      $unwind: {
        path: '$aadhar',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'officedepartments',
        localField: 'officeDepartmentId',
        foreignField: '_id',
        as: 'officeDepartment',
      },
    },
    {
      $unwind: {
        path: '$officeDepartment',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'offices',
        localField: 'officeDepartment.officeId',
        foreignField: '_id',
        as: 'office',
      },
    },
    {
      $unwind: {
        path: '$office',
        preserveNullAndEmptyArrays: true,
      },
    },

 
    {
  $lookup: {
    from: 'roles',
    localField: 'roleId',
    foreignField: '_id',
    as: 'role',
  },
},
{
  $unwind: {
    path: '$role',
    preserveNullAndEmptyArrays: true,
  },
},
    
    {
      $lookup: {
        from: 'districts',
        localField: 'office.districtId',
        foreignField: '_id',
        as: 'district',
      },
    },
    {
      $unwind: {
        path: '$district',
        preserveNullAndEmptyArrays: true,
      },
    },
    
    {
      $lookup: {
        from: 'departments',
        localField: 'officeDepartment.departmentId',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: {
        path: '$department',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          {
            employeeId: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            email: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'aadhar.firstName': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'aadhar.middleName': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'aadhar.lastName': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'aadhar.contact': {
              $regex: search,
              $options: 'i',
            }
          },
          {
            'office.name': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            status: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      },
    });
  }

  const countPipeline = [...pipeline];

  countPipeline.push({
    $count: 'total',
  });

  const countResult = await this.userModel.aggregate(countPipeline);

  const total =
    countResult.length > 0 ? countResult[0].total : 0;

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
      employeeId: 1,
      email: 1,
      status: 1,
      createdAt: 1,

      aadharId: '$aadhar',
      roleId: '$role',
      officeDepartmentId: {
    _id: "$officeDepartment._id",

    officeId: {
      _id: "$office._id",
      name: "$office.name",
       districtId: {
      _id: "$district._id",
      name: "$district.name",
    },
    },

    departmentId: {
      _id: "$department._id",
      name: "$department.name",
    },
  },
    },
  });

  const data = await this.userModel.aggregate(pipeline);

  return {
    data,
    total,
    page,
    limit,
    search,
    totalPages: Math.ceil(total / limit),
  };
}

  async findById(id: string) {
    return this.userModel
      .findById(id)
      .populate('roleId')
      .populate('aadharId')
      .populate({
         path: 'officeDepartmentId',
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
        });
        
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByAadharNumber(aadharNumber: string) {
    return this.userModel.findOne({ aadharNumber });
  }

  async findAvailableClerk( officeDepartmentId:string, clerkRoleId:string ){

    return this.userModel.findOne({
      officeDepartmentId:toObjectId(officeDepartmentId),
      roleId:toObjectId(clerkRoleId),
      isAvailable:true })
   .sort({
      assignedApplicationCount:1
  });

}

async incrementAssignedApplicationCount(clerkId:string){

    return this.userModel.findByIdAndUpdate(
        clerkId,
        {
            $inc:{
                assignedApplicationCount:1
            }
        },
        {
            new:true
        }
    );

}

  async findByOfficeDepartmentId(officeDepartmentId: string){
    return this.userModel.find({
      officeDepartmentId: toObjectId(officeDepartmentId),
    });
  }

  async update(id: string, updateClerkDto: UpdateClerkDto) {
    return this.userModel.findByIdAndUpdate(id, updateClerkDto, 
    {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findByEmployeeId(employeeId: string) {
    return this.userModel.findOne({ employeeId });
  }

  async countClerksByOfficeDepartment(
    officeDepartmentId: string,
    clerkRoleId: string,
  ) {
    return this.userModel.countDocuments({
      officeDepartmentId: toObjectId(officeDepartmentId),
      roleId: toObjectId(clerkRoleId),
    });
  }
}