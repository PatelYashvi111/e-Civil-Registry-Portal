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

  @Cron('1 0 * * *')
  async generateSlotsDaily() {
    console.log('Cron Started');

    const officeDepartments =
      await this.officeDepartmentRepository.findAll();

    const date = new Date();
    date.setDate(date.getDate() + 60);

    const slotDate = date.toISOString().split('T')[0];

    for (const officeDepartment of officeDepartments) {
      try {
        await this.slotService.generateSlots(
          officeDepartment.id,
          slotDate,
        );
      } catch (err) {
      console.log(`Error for office ${officeDepartment.id}:`, err.message);
      }
    }

    console.log('Cron Finished');
  }
}