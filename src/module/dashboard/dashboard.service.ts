import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { Role } from '../role/schema/role.schema';
import { Application } from '../application/schema/application.schema';
import { State } from '../state/schema/state.schema';
import { District } from '../district/schema/district.schema';
import { Office } from '../office/schema/office.schema';
import { Department } from '../department/schema/department.schema';
import { RoleEnum } from '../../common/enums/role.enums';
import { ApplicationStatusEnum } from 'src/common/enums/application.status.enums';
import { toObjectId } from 'src/common/utils/objectId.utils';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,

    @InjectModel(State.name)
    private readonly stateModel: Model<State>,

    @InjectModel(District.name)
    private readonly districtModel: Model<District>,

    @InjectModel(Office.name)
    private readonly officeModel: Model<Office>,

    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}

  async getDashboard(type?: string) {
  const userRole = await this.roleModel.findOne({
    name: RoleEnum.USER,
  });

  const clerkRole = await this.roleModel.findOne({
    name: RoleEnum.CLERK,
  });

  const [
    totalUsers,
    totalClerks,
    totalStates,
    totalDistricts,
    totalOffices,
    totalDepartments,
    totalApplications,
    approvedApplications,
    pendingApplications,
    rejectedApplications,
  ] = await Promise.all([
    this.userModel.countDocuments({
      roleId: userRole?._id,
    }),

    this.userModel.countDocuments({
      roleId: clerkRole?._id,
    }),

    this.stateModel.countDocuments(),

    this.districtModel.countDocuments(),

    this.officeModel.countDocuments(),

    this.departmentModel.countDocuments(),

    this.applicationModel.countDocuments(),

    this.applicationModel.countDocuments({
      status: ApplicationStatusEnum.APPROVED,
    }),

    this.applicationModel.countDocuments({
      status: ApplicationStatusEnum.PENDING,
    }),

    this.applicationModel.countDocuments({
      status: ApplicationStatusEnum.REJECTED,
    }),
  ]);

  return { 
    totalUsers,
    totalClerks,
    totalStates,
    totalDistricts,
    totalOffices,
    totalDepartments,
    totalApplications,
    approvedApplications,
    pendingApplications,
    rejectedApplications,
  };
}

async clerkDashboard(clerkId: string) {

  const clerkObjectId = toObjectId(clerkId);

  const [
    totalApplications,
    approvedApplications,
    pendingApplications,
    rejectedApplications,
  ] = await Promise.all([
    this.applicationModel.countDocuments({
      clerkId: clerkObjectId,
    }),

    this.applicationModel.countDocuments({
      clerkId: clerkObjectId,
      status: ApplicationStatusEnum.APPROVED,
    }),

    this.applicationModel.countDocuments({
      clerkId: clerkObjectId,
      status: ApplicationStatusEnum.PENDING,
    }),

    this.applicationModel.countDocuments({
      clerkId: clerkObjectId,
      status: ApplicationStatusEnum.REJECTED,
    }),
  ]);

  return {
    totalApplications,
    approvedApplications,
    pendingApplications,
    rejectedApplications,
  };
}
}
