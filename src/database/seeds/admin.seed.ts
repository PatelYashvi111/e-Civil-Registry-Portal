import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../module/user/schema/user.schema';
import { Role, RoleDocument } from '../../module/role/schema/role.schema';
import { Aadhar, AadharDocument } from '../../module/aadhar/schema/aadhar.schema';
import { toObjectId } from 'src/common/utils/objectId.utils';
import { RoleEnum } from 'src/common/enums/role.enums';
import { ClerkStatusEnum } from 'src/common/enums/clerk.status.enums';

@Injectable()
export class AdminSeed {
  private readonly logger = new Logger(AdminSeed.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,

    @InjectModel(Aadhar.name)
    private readonly aadharModel: Model<AadharDocument>,
  ) {}

  async seed(): Promise<void> {

    const adminRole = await this.roleModel.findOne({
      name: RoleEnum.ADMIN,
    });

    if (!adminRole) {
      throw new Error('ADMIN role not found. Please seed roles first.');
    }

    const adminAadhar = await this.aadharModel.findOne({
    aadharNumber: process.env.DEFAULT_ADMIN_AADHAR,
    });

    if (!adminAadhar) {
    throw new Error('Admin Aadhar not found');
    }
    
    const existingAdmin = await this.userModel.findOne({
      email: process.env.DEFAULT_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      this.logger.log('Default admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD!,
      10,
    );

    await this.userModel.create({
      email: process.env.DEFAULT_ADMIN_EMAIL,           
      password: hashedPassword,
      roleId: adminRole._id,   
      aadharId: adminAadhar._id,
      status: ClerkStatusEnum.ACTIVE,
    });

    this.logger.log('Default admin created successfully.');
  }
}