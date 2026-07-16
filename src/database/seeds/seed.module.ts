import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';
import { SeedService } from '../seeds/seed.service';
import { SeedController } from '../seeds/seed.controller';
import { State, StateSchema } from '../../module/state/schema/state.schema';
import { District, DistrictSchema } from '../../module/district/schema/district.schema';
import { Office, OfficeSchema } from '../../module/office/schema/office.schema';
import { OfficeDepartment, OfficeDepartmentSchema } from '../../module/officeDepartment/schema/officeDepartment.schema';
import { Department, DepartmentSchema } from '../../module/department/schema/department.schema';
import { AdminSeed } from './admin.seed';
import { User, UserSchema } from 'src/module/user/schema/user.schema';
import { Role, RoleSchema } from 'src/module/role/schema/role.schema';
import { Aadhar, AadharSchema } from 'src/module/aadhar/schema/aadhar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: State.name, schema: StateSchema },
        { name: District.name, schema: DistrictSchema },
        { name: Office.name, schema: OfficeSchema },
        { name: OfficeDepartment.name, schema: OfficeDepartmentSchema },
        { name: Department.name, schema: DepartmentSchema },
        { name: User.name, schema: UserSchema },
        { name: Role.name, schema: RoleSchema },
        { name: Aadhar.name, schema: AadharSchema },
    ]),
  ],

  controllers: [SeedController],
  providers: [SeedService,AdminSeed],
  exports: [SeedService,AdminSeed],

})

export class SeedModule {}