import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../user/schema/user.schema';
import { Role, RoleSchema } from '../role/schema/role.schema';
import { Application, ApplicationSchema } from '../application/schema/application.schema';
import { State, StateSchema } from '../state/schema/state.schema';
import { District, DistrictSchema } from '../district/schema/district.schema';
import { Office, OfficeSchema } from '../office/schema/office.schema';
import { Department, DepartmentSchema } from '../department/schema/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: State.name, schema: StateSchema },
      { name: District.name, schema: DistrictSchema },
      { name: Office.name, schema: OfficeSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}