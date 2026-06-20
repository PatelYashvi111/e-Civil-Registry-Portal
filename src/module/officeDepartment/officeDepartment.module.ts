import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OfficeDepartment, OfficeDepartmentSchema } from './schema/officeDepartment.schema';
import { OfficeDepartmentController } from './officeDepartment.controller';
import { OfficeDepartmentService } from './officeDepartment.service';
import { OfficeDepartmentRepository } from './officeDepartment.repository';
import { OfficeRepository } from '../office/office.repository';
import { Office, OfficeSchema } from '../office/schema/office.schema';
import { Department, DepartmentSchema } from '../department/schema/department.schema';
import { DepartmentRepository } from '../department/department.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OfficeDepartment.name,
        schema: OfficeDepartmentSchema,
      },
      {
        name: Office.name,
        schema: OfficeSchema,
      },
      {
        name: Department.name,
        schema: DepartmentSchema,
      },
    ]),
  ],
  
  controllers: [OfficeDepartmentController],
  providers: [OfficeDepartmentService,OfficeDepartmentRepository,OfficeRepository,DepartmentRepository],
  exports: [OfficeDepartmentService,OfficeDepartmentRepository],
})

export class OfficeDepartmentModule {}