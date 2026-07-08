import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { State } from '../../module/state/schema/state.schema';
import { District } from '../../module/district/schema/district.schema';
import { Office } from '../../module/office/schema/office.schema';
import { Department } from '../../module/department/schema/department.schema';
import { OfficeDepartment } from '../../module/officeDepartment/schema/officeDepartment.schema';
import { toObjectId } from 'src/common/utils/objectId.utils';
import { AdminSeed } from './admin.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(State.name) private stateModel: Model<State>,
    @InjectModel(District.name) private districtModel: Model<District>,
    @InjectModel(Office.name) private officeModel: Model<Office>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(OfficeDepartment.name) private officeDepartmentModel: Model<OfficeDepartment>,
    private readonly adminSeed: AdminSeed,
  ) {}

  async seed() {
    await this.stateModel.deleteMany({});
    await this.districtModel.deleteMany({});
    await this.officeModel.deleteMany({});
    await this.departmentModel.deleteMany({});
    await this.officeDepartmentModel.deleteMany({});

    const state = await this.stateModel.create({
      name: 'Gujarat',
    });

    const districts = [
      { name: 'Ahmedabad' },
      { name: 'Amreli' },
      { name: 'Anand' },
      { name: 'Aravalli' },
      { name: 'Banaskantha' },
      { name: 'Bharuch' },
      { name: 'Bhavnagar' },
      { name: 'Botad' },
      { name: 'Chhota Udaipur' },
      { name: 'Dahod' },
      { name: 'Dang' },
      { name: 'Devbhoomi Dwarka' },
      { name: 'Gandhinagar' },
      { name: 'Gir Somnath' },
      { name: 'Jamnagar' },
      { name: 'Junagadh' },
      { name: 'Kheda' },
      { name: 'Kutch' },
      { name: 'Mahisagar' },
      { name: 'Mehsana' },
      { name: 'Morbi' },
      { name: 'Narmada' },
      { name: 'Navsari' },
      { name: 'Panchmahal' },
      { name: 'Patan' },
      { name: 'Porbandar' },
      { name: 'Rajkot' },
      { name: 'Sabarkantha' },
      { name: 'Surat' },
      { name: 'Surendranagar' },
      { name: 'Tapi' },
      { name: 'Vadodara' },
      { name: 'Valsad' },
      { name: 'Vav-Tharad' },
    ];

    const districtDocs = await this.districtModel.insertMany(
      districts.map((d) => ({
        name: d.name,
        stateId: state._id,
      })),
    );

    const office = await this.officeModel.create({
      name: 'Gandhinagar Head Office',
      districtId: districtDocs[0]._id,
    });

    const departments = await this.departmentModel.insertMany([
      { name: 'Birth' },
      { name: 'Death' },
      { name: 'Marriage' },
    ]);

    for (const dept of departments) {
      await this.officeDepartmentModel.create({
        officeId: office._id,
        departmentId: dept._id,
      });
    }


    await this.adminSeed.seed();

    return {
      message: 'Seed completed successfully',
    };
  }
}