import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OfficeDepartmentRepository } from '../officeDepartment/officeDepartment.repository';
import { SlotService } from './slot.service';

@Injectable()
export class SlotCron {
  constructor(
    private readonly slotService: SlotService,
    private readonly officeDepartmentRepository: OfficeDepartmentRepository,
  ) {}

  @Cron('27 8 * * *')
  async generateSlotsDaily() {
    console.log('========== Cron Started ==========');

    const officeDepartments =
      await this.officeDepartmentRepository.findAll();

    const date = new Date();
    date.setDate(date.getDate() + 60);

    const slotDate = date.toISOString().split('T')[0];

    console.log('Slot Date:', slotDate);
    console.log('Total Office Departments:', officeDepartments.length);

    for (const officeDepartment of officeDepartments) {

      console.log(
        `Generating slots for OfficeDepartment: ${officeDepartment.id}`,
      );

      try {
        await this.slotService.generateSlots(
          officeDepartment.id,
          slotDate,
        );

        console.log(
          `Slots generated successfully for OfficeDepartment: ${officeDepartment.id}`,
        );

      } catch (err) {
  if (err instanceof Error) {
    console.log(
      `Error for OfficeDepartment ${officeDepartment.id}: ${err.message}`,
    );
  } else {
    console.log(
      `Error for OfficeDepartment ${officeDepartment.id}:`,
      err,
    );
  }
}
    }

    console.log('========== Cron Finished ==========');
  }
}

// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { OfficeDepartmentRepository } from '../officeDepartment/officeDepartment.repository';
// import { SlotService } from './slot.service';

// @Injectable()
// export class SlotCron {
//   constructor(
//     private readonly slotService: SlotService,
//     private readonly officeDepartmentRepository: OfficeDepartmentRepository,
//   ) {}

//   @Cron('* /5 * * *')
//   async generateSlotsDaily() {
//     console.log('Cron Started');

//     const officeDepartments =
//       await this.officeDepartmentRepository.findAll();

//     const date = new Date();
//     date.setDate(date.getDate() + 60);

//     const slotDate = date.toISOString().split('T')[0];

//     for (const officeDepartment of officeDepartments) {
//       try {
//         await this.slotService.generateSlots(
//           officeDepartment.id,
//           slotDate,
//         );
//       } catch (err) {
//       console.log(`Error for office ${officeDepartment.id}:`, err.message);
//       }
//     }

//     console.log('Cron Finished');
//   }
// }