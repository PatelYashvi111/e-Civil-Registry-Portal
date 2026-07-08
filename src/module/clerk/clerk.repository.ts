import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { toObjectId } from 'src/common/utils/objectId.utils';

@Injectable()
export class ClerkRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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
      .populate('officeDepartmentId');

    return clerk;
  }

  async findAllClerks( clerkRoleId: string, skip: number, limit: number, page: number ) {
    const filter = { roleId: toObjectId(clerkRoleId) };
    const data = await this.userModel
      .find(filter)
      .populate('roleId')
      .populate('aadharId')
      .populate('officeDepartmentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.userModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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