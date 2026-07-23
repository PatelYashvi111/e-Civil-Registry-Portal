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

  switch (type) {
    case 'totalUsers':
      return {
        totalUsers: await this.userModel.countDocuments({
          roleId: userRole?._id,
        }),
      };

    case 'totalClerks':
      return {
        totalClerks: await this.userModel.countDocuments({
          roleId: clerkRole?._id,
        }),
      };

    case 'totalStates':
      return {
        totalStates: await this.stateModel.countDocuments(),
      };

    case 'totalDistricts':
      return {
        totalDistricts: await this.districtModel.countDocuments(),
      };

    case 'totalOffices':
      return {
        totalOffices: await this.officeModel.countDocuments(),
      };

    case 'totalDepartments':
      return {
        totalDepartments: await this.departmentModel.countDocuments(),
      };

    case 'totalApplications':
      return {
        totalApplications: await this.applicationModel.countDocuments(),
      };

    case 'approvedApplications':
      return {
        approvedApplications: await this.applicationModel.countDocuments({
          status: ApplicationStatusEnum.APPROVED,
        }),
      };

    case 'pendingApplications':
      return {
        pendingApplications: await this.applicationModel.countDocuments({
          status: ApplicationStatusEnum.PENDING,
        }),
      };

    case 'rejectedApplications':
      return {
        rejectedApplications: await this.applicationModel.countDocuments({
          status: ApplicationStatusEnum.REJECTED,
        }),
      };
  }

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
    this.userModel.countDocuments({ roleId: userRole?._id }),
    this.userModel.countDocuments({ roleId: clerkRole?._id }),
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
}