import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OfficeDepartmentRepository } from '../officeDepartment/officeDepartment.repository';
import { SlotService } from './slot.service';

@Injectable()
export class SlotCron {
  private readonly logger = new Logger(SlotCron.name);

  constructor(
    private readonly slotService: SlotService,
    private readonly officeDepartmentRepository: OfficeDepartmentRepository,
  ) {}

  // Runs every day at 12:01 AM
  @Cron('1 0 * * *')
  async generateSlotsDaily() {
    this.logger.log('Slot generation cron started.');

    // If findAll() returns pagination
   const result = await this.officeDepartmentRepository.findAll({
  page: 1,
  limit: Number.MAX_SAFE_INTEGER,
});

    const officeDepartments = result.data;

    const date = new Date();
    date.setDate(date.getDate() + 60);

    const slotDate = date.toISOString().split('T')[0];

    for (const officeDepartment of officeDepartments) {
      try {
        await this.slotService.generateSlots(
          officeDepartment._id.toString(),
          slotDate,
        );

        this.logger.log(
          `Slots generated for OfficeDepartment: ${officeDepartment._id}`,
        );
      }  catch (error) {
  const err = error as Error;

  this.logger.error(
    `Error generating slots for OfficeDepartment ${officeDepartment._id}: ${err.message}`,
  );
}
    }

    this.logger.log('Slot generation cron finished.');
  }
}