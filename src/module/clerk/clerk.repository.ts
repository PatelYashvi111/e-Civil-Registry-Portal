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

  async createClerk(createClerkDto: CreateClerkDto) {
    const createdClerk = new this.userModel({
      ...createClerkDto,
      roleId: toObjectId(createClerkDto.roleId),
      aadharId: toObjectId(createClerkDto.aadharId),
      officeDepartmentId: toObjectId(createClerkDto.officeDepartmentId),
    });

    return createdClerk.save();
  }

  async findAllClerks( clerkRoleId: string, skip: number, limit: number, page: number ) {
    const filter = { roleId: toObjectId(clerkRoleId) };
    const data = await this.userModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await this.userModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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