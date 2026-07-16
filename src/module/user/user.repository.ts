import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Types } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { toObjectId } from "src/common/utils/objectId.utils";

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel( User.name ) private userModel: Model<UserDocument>
    ){}

    async createUser( createUserDto: CreateUserDto ){

        const createdUser = new this.userModel({
            ...createUserDto,
            roleId: toObjectId(createUserDto.roleId),
            aadharId: toObjectId(createUserDto.aadharId),
            officeDepartmentId: createUserDto.officeDepartmentId
            ? toObjectId(createUserDto.officeDepartmentId)
            : undefined,
    });
        
        return createdUser.save();
    }

    async findByEmail( email: string ){
        return this.userModel.findOne({ email });
    }

    async findById( id: string ){
        return this.userModel.findById( id );
    }

    async findAll(
  userRoleId: string,
  skip: number,
  limit: number,
  page: number,
  search?: string,
) {
  const pipeline: any[] = [
    {
      $match: {
        roleId: toObjectId(userRoleId),
      },
    },

    // Aadhar Lookup
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

    // Role Lookup
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
  ];

  // Search
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { 'aadhar.firstName': { $regex: search, $options: 'i' } },
          { 'aadhar.middleName': { $regex: search, $options: 'i' } },
          { 'aadhar.lastName': { $regex: search, $options: 'i' } },
          { 'aadhar.contact': { $regex: search, $options: 'i' } },
          { 'aadhar.aadharNumber': { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { 'office.officeName': { $regex: search, $options: 'i' } },
          { 'department.departmentName': { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  // Total Count
  const countPipeline = [...pipeline];

  countPipeline.push({
    $count: 'total',
  });

  const countResult = await this.userModel.aggregate(countPipeline);

  const total = countResult.length ? countResult[0].total : 0;

  // Pagination & Projection
  pipeline.push(
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
    $project: {
  _id: 1,
  email: 1,
  status: 1,
  createdAt: 1,

  aadharId: '$aadhar',
  roleId: '$role',
}
    },
  );

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

    async updateUser( id: string, updateUserDto: UpdateUserDto ){
         console.log("ID:", id);
    console.log("DTO:", updateUserDto);
        return this.userModel.findByIdAndUpdate( id, updateUserDto, { returnDocument: 'after' } );
    }

    async deleteUser( id: string ){
        return this.userModel.findByIdAndDelete( id );
    }
}
