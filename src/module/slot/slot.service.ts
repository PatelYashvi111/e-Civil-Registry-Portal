import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { SlotRepository } from './slot.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { OfficeDepartmentRepository } from '../officeDepartment/officeDepartment.repository';
import { RoleEnum } from 'src/common/enums/role.enums';

@Injectable()
export class SlotService {
  constructor(
    private readonly slotRepository: SlotRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly officeDepartmentRepository: OfficeDepartmentRepository,
  ) {}

  async generateSlots(officeDepartmentId: string, slotDate: string) {
    const officeDepartment = await this.officeDepartmentRepository.findById(officeDepartmentId);
    
    if (!officeDepartment) {
      throw new NotFoundException('Office department not found');
    }

    const clerkRole = await this.roleRepository.findByName(RoleEnum.CLERK);

    if(!clerkRole) {
      throw new NotFoundException('Clerk role not found');
    }

    console.log("OfficeDepartmentId:", officeDepartmentId);
    console.log("Clerk Role Id:", clerkRole.id);

    const clerkCount =
    await this.userRepository.countClerksByOfficeDepartment(
      officeDepartmentId,
      clerkRole._id,
  );

      console.log("Clerk Count:", clerkCount);

      if(clerkCount === 0) {
        throw new NotFoundException('No clerks found for the office department');
      }

    const existingSlot =
      await this.slotRepository.findByOfficeDepartmentAndDate(
        officeDepartmentId,
        new Date(slotDate)
      );
    
      if(existingSlot) {
        throw new BadRequestException('Slot already exists for the given date');
      }

    const timings = [
      ['10:00', '10:30'],
      ['10:30', '11:00'],
      ['11:00', '11:30'],
      ['11:30', '12:00'],
      ['12:00', '12:30'],
      ['12:30', '13:00'], 
      ['14:00', '14:30'],
      ['14:30', '15:00'],
      ['15:00', '15:30'],
      ['15:30', '16:00'],
      ['16:00', '16:30'],
      ['16:30', '17:00'],
      ['17:00', '17:30'],
      ['17:30', '18:00'],
    ];

    const slots = timings.map(([startTime, endTime]) => ({
      officeDepartmentId: new Types.ObjectId(officeDepartmentId),
      slotDate: new Date(slotDate),
      startTime,
      endTime,
      maxCapacity: clerkCount,
      bookedCount: 0,
      isAvailable: true,
    }));

    return await this.slotRepository.createMany(slots);
  }

  async findAll() {
    return await this.slotRepository.findAll();
  }

  async findById(id: string) {
    const slot = await this.slotRepository.findById(id);

    if (!slot) {
      throw new Error('Slot not found');
    }

    return slot;
  }

  async getAvailableDates(officeDepartmentId: string) {
    const officeDepartment = await this.officeDepartmentRepository.findById(officeDepartmentId);

    if(!officeDepartment) {
      throw new Error('Office department not found');
    }

    return await this.slotRepository.findAvailableDates(officeDepartmentId);
  }

  async getAvailableSlots(
    officeDepartmentId: string,
    slotDate: string,
  ) {
    const officeDepartment = await this.officeDepartmentRepository.findById(officeDepartmentId);

    if(!officeDepartment) {
      throw new Error('Office department not found');
    }

    const slot = await this.slotRepository.findAvailableSlots(officeDepartmentId, new Date(slotDate));

    if(!slot) {
      throw new Error('No available slots found');
    }

    return slot;
  }

  async bookSlot(slotId: string) {
    const slot = await this.slotRepository.findById(slotId);

    if(!slot) {
      throw new Error('Slot not found');
    }

    if(!slot.isAvailable) {
      throw new Error('Slot is not available');
    }

    if(slot.bookedCount >= slot.maxCapacity) {
      throw new Error('Slot is full');
    }

    const bookedCount = slot.bookedCount + 1;

    const updateData = {
      bookedCount,
      isAvailable: bookedCount < slot.maxCapacity,
    };

    return await this.slotRepository.update(slotId, updateData);
  }

  async delete(id: string) {
    const slot = await this.slotRepository.findById(id);

    if(!slot) {
      throw new Error('Slot not found');
    }

    return await this.slotRepository.delete(id);
  }
}
