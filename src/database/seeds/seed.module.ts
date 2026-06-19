import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';
import { SeedService } from '../seeds/seed.service';
import { State, StateSchema } from '../../module/state/schema/state.schema';
import { District, DistrictSchema } from '../../module/district/schema/district.schema';
import { Office, OfficeSchema } from '../../module/office/schema/office.schema';
import { OfficeDepartment, OfficeDepartmentSchema } from '../../module/officeDepartment/schema/officeDepartment.schema';
import { Department, DepartmentSchema } from '../../module/department/schema/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: State.name, schema: StateSchema },
        { name: District.name, schema: DistrictSchema },
        { name: Office.name, schema: OfficeSchema },
        { name: OfficeDepartment.name, schema: OfficeDepartmentSchema },
        { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  providers: [SeedService],
})

export class DatabaseModule {}