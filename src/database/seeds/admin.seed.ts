import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../module/user/schema/user.schema';
import { Role } from '../../module/role/schema/role.schema';

@Injectable()
export class AdminSeed {
  private readonly logger = new Logger(AdminSeed.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async seed(): Promise<void> {
    const adminRole = await this.roleModel.findOne({
      name: 'ADMIN',
    });

    if (!adminRole) {
      throw new Error('ADMIN role not found. Please seed roles first.');
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
      name: process.env.DEFAULT_ADMIN_NAME,
      email: process.env.DEFAULT_ADMIN_EMAIL,
      phone: process.env.DEFAULT_ADMIN_PHONE,
      password: hashedPassword,
      role: adminRole._id,
      isRegistered: true,
      isActive: true,
    });

    this.logger.log('Default admin created successfully.');
  }
}