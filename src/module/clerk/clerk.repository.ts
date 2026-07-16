// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from '../user/schema/user.schema';
// import { Clerk, ClerkDocument } from './schema/clerk.scheama';
// import { CreateClerkDto } from './dto/create-clerk.dto';
// import { UpdateClerkDto } from './dto/update-clerk.dto';
// import { toObjectId } from 'src/common/utils/objectId.utils';

// @Injectable()
// export class ClerkRepository {
//   constructor(
//     @InjectModel(User.name)
//     private readonly userModel: Model<UserDocument>,
//     @InjectModel(Clerk.name)
//     private readonly clerkModel: Model<ClerkDocument>,
//   ) {}

//   async createClerk(
//     createClerkDto: CreateClerkDto,
//     roleId: string,
//   ) {
//     const createdClerk = new this.userModel({
//       ...createClerkDto,
//       roleId: toObjectId(roleId),
//       aadharNumber: createClerkDto.aadharNumber,
//       officeDepartmentId: toObjectId(createClerkDto.officeDepartmentId),
//     });

//     const savedClerk = await createdClerk.save();

//     const clerk = await this.userModel
//       .findById(savedClerk._id)
//       .populate('roleId')
//       .populate('officeDepartmentId')

//     return clerk;
//   }

//   async findAllClerks(
//   clerkRoleId: string,
//   skip: number,
//   limit: number,
//   page: number,
//   search?: string,
// ) {

//   const pipeline: any[] = [

//     // Get only clerks
//     {
//       $match: {
//         roleId: toObjectId(clerkRoleId),
//       },
//     },

//     // Aadhar
//     {
//       $lookup: {
//         from: 'aadhars',
//         localField: 'aadharId',
//         foreignField: '_id',
//         as: 'aadhar',
//       },
//     },
//     {
//       $unwind: {
//         path: '$aadhar',
//         preserveNullAndEmptyArrays: true,
//       },
//     },

//     // Office Department
//     // {
//     //   $lookup: {
//     //     from: 'officedepartments',
//     //     localField: 'officeDepartmentId',
//     //     foreignField: '_id',
//     //     as: 'officeDepartment',
//     //   },
//     // },
//     // {
//     //   $unwind: {
//     //     path: '$officeDepartment',
//     //     preserveNullAndEmptyArrays: true,
//     //   },
//     // },

//     // Office
//     {
//       $lookup: {
//         from: 'offices',
//         localField: 'officeId',
//         foreignField: '_id',
//         as: 'office',
//       },
//     },
//     {
//       $unwind: {
//         path: '$office',
//         preserveNullAndEmptyArrays: true,
//       },
//     },

//     {
//   $lookup: {
//     from: 'roles',
//     localField: 'roleId',
//     foreignField: '_id',
//     as: 'role',
//   },
// },
// {
//   $unwind: {
//     path: '$role',
//     preserveNullAndEmptyArrays: true,
//   },
// },
    
//     {
//       $lookup: {
//         from: 'districts',
//         localField: 'office.districtId',
//         foreignField: '_id',
//         as: 'district',
//       },
//     },
//     {
//       $unwind: {
//         path: '$district',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
    
//     {
//       $lookup: {
//         from: 'departments',
//         localField: 'deapartmentId',
//         foreignField: '_id',
//         as: 'department',
//       },
//     },
//     {
//       $unwind: {
//         path: '$department',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//   ];

//   // Search
//   if (search) {
//     pipeline.push({
//       $match: {
//         $or: [
//           {
//             employeeId: {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//           {
//             email: {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//           {
//             'aadhar.firstName': {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//           {
//             'aadhar.middleName': {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//           {
//             'aadhar.lastName': {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//           {
//             'office.name': {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//           {
//             status: {
//               $regex: search,
//               $options: 'i',
//             },
//           },
//         ],
//       },
//     });
//   }

//   // Count Pipeline
//   const countPipeline = [...pipeline];

//   countPipeline.push({
//     $count: 'total',
//   });

//   const countResult = await this.userModel.aggregate(countPipeline);

//   const total =
//     countResult.length > 0 ? countResult[0].total : 0;

//   // Sorting
//   pipeline.push({
//     $sort: {
//       createdAt: -1,
//     },
//   });

//   // Pagination
//   pipeline.push(
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//   );

//   // Select fields
//   pipeline.push({
//     $project: {
//       _id: 1,
//       employeeId: 1,
//       email: 1,
//       status: 1,
//       createdAt: 1,

//       aadharId: '$aadhar',
//       officeDepartmentId: '$officeDepartment',
//       officeId: '$office',
//       roleId: '$role',
//       departmentId: '$department',
//     },
//   });

//   const data = await this.userModel.aggregate(pipeline);

//   return {
//     data,
//     total,
//     page,
//     limit,
//     search,
//     totalPages: Math.ceil(total / limit),
//   };
// }

//   async findById(id: string) {
//     return this.userModel
//       .findById(id)
//       .populate('roleId')
//       .populate('officeDepartmentId')
//       .populate('districtId');
//   }

//   async findByEmail(email: string) {
//     return this.userModel.findOne({ email });
//   }

//   async findByAadharNumber(aadharNumber: string) {
//     return this.userModel.findOne({ aadharNumber });
//   }

//   async findByOfficeDepartmentId(officeDepartmentId: string) {
//     return this.userModel.find({
//       officeDepartmentId: toObjectId(officeDepartmentId),
//     });
//   }

//   async findBydistrictId(districtId: string) {
//     return this.userModel.find({ districtId });
//   }


//   async update(id: string, updateClerkDto: UpdateClerkDto) {
//     return this.userModel.findByIdAndUpdate(id, updateClerkDto, {
//       new: true,
//       runValidators: true,
//     });
//   }

//   async delete(id: string) {
//     return this.userModel.findByIdAndDelete(id);
//   }

//   async findByEmployeeId(employeeId: string) {
//     return this.userModel.findOne({ employeeId });
//   }

//   async countClerksByOfficeDepartment(
//     officeDepartmentId: string,
//     clerkRoleId: string,
//   ) {
//     return this.userModel.countDocuments({
//       officeDepartmentId: toObjectId(officeDepartmentId),
//       roleId: toObjectId(clerkRoleId),
//     });
//   }
// }


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Clerk, ClerkDocument } from './schema/clerk.scheama';
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
      officeId: toObjectId(createClerkDto.officeId),
      departmentId: toObjectId(createClerkDto.departmentId),
    });

    const savedClerk = await createdClerk.save();

    const clerk = await this.userModel
      .findById(savedClerk._id)
      .populate('roleId')
      .populate('aadharId')
      .populate('officeId')
      .populate('departmentId')

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

    // Get only clerks
    {
      $match: {
        roleId: toObjectId(clerkRoleId),
      },
    },

    // Aadhar
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

    // Office Department
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

    // Office
    {
      $lookup: {
        from: 'offices',
        localField: 'officeId',
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

    // District
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
  ];

  // Search
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
            'office.name': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'district.name': {
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

  // Count Pipeline
  const countPipeline = [...pipeline];

  countPipeline.push({
    $count: 'total',
  });

  const countResult = await this.userModel.aggregate(countPipeline);

  const total =
    countResult.length > 0 ? countResult[0].total : 0;

  // Sorting
  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  // Pagination
  pipeline.push(
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  );

  // Select fields
  pipeline.push({
    $project: {
      _id: 1,
      employeeId: 1,
      email: 1,
      status: 1,
      createdAt: 1,

      firstName: '$aadhar.firstName',
      middleName: '$aadhar.middleName',
      lastName: '$aadhar.lastName',

      officeName: '$office.name',

      districtName: '$district.name',
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
      .populate({path: 'officeId', populate : {path: 'districtId'}})
      .populate('departmentId')
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByAadharNumber(aadharNumber: string) {
    return this.userModel.findOne({ aadharNumber });
  }

  async findByOfficeId(officeId: string) {
    return this.userModel.find({
      officeId: toObjectId(officeId),
    });
  }

  async findByDepartmentId(departmentId: string) {
    return this.userModel.find({
      departmentId: toObjectId(departmentId),
    });
  }


  async update(id: string, updateClerkDto: UpdateClerkDto) {
    return this.userModel.findByIdAndUpdate(id, updateClerkDto, {
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