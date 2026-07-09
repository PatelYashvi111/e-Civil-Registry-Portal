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
      aadharNumber: createClerkDto.aadharNumber,
      officeDepartmentId: toObjectId(createClerkDto.officeDepartmentId),
      districtId: toObjectId(createClerkDto.districtId),
    });

    const savedClerk = await createdClerk.save();

    const clerk = await this.userModel
      .findById(savedClerk._id)
      .populate('roleId')
      .populate('officeDepartmentId')
      .populate('districtId');

    return clerk;
  }

  async findAllClerks(
    clerkRoleId: string,
    skip: number,
    limit: number,
    page: number,
  ) {
    const filter = {
      roleId: toObjectId(clerkRoleId),
    };

    const data = await this.userModel
      .find(filter)
      .populate('roleId')
      .populate('officeDepartmentId')
      .populate('districtId')
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

  async findById(id: string) {
    return this.userModel
      .findById(id)
      .populate('roleId')
      .populate('officeDepartmentId')
      .populate('districtId');
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByAadharNumber(aadharNumber: string) {
    return this.userModel.findOne({ aadharNumber });
  }

  async findByOfficeDepartmentId(officeDepartmentId: string) {
    return this.userModel.find({
      officeDepartmentId: toObjectId(officeDepartmentId),
    });
  }

  async findBydistrictId(districtId: string) {
    return this.userModel.find({
      districtId: toObjectId(districtId),
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